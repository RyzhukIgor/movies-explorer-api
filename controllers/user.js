const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ConflictUserErr = require('../errors/ConflictUserErr');
const NotAuthError = require('../errors/NotAuthError');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/configurations');
const {
  USER_NOT_FOUND_MESSAGE,
  USER_ACCOUNT_ALREADY_EXISTS,
  USER_INCORRECT_DATA,
  INCORRECT_EMAIL_OR_PASSWORD,
} = require('../utils/constants');
const {
  STATUS_CREATED,
} = require('../errors/errors');

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new ErrorNotFound(USER_NOT_FOUND_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(USER_NOT_FOUND_MESSAGE);
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictUserErr(USER_ACCOUNT_ALREADY_EXISTS));
      } else if (error.name === 'ValidationError') {
        next(new ErrorBadRequest(USER_INCORRECT_DATA));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.status(STATUS_CREATED).send({ message: 'Пользователь создан' }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictUserErr(USER_ACCOUNT_ALREADY_EXISTS));
      } else if (error.name === 'ValidationError') {
        next(new ErrorBadRequest(USER_INCORRECT_DATA));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => { throw new NotAuthError(INCORRECT_EMAIL_OR_PASSWORD); })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw NotAuthError(INCORRECT_EMAIL_OR_PASSWORD);
        }
        return user;
      }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
