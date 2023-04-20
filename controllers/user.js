const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ConflictUserErr = require('../errors/ConflictUserErr');
const NotAuthError = require('../errors/NotAuthError');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/configurations');

const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../errors/errors');

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new ErrorNotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('Пользователь не найден');
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
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
        next(new ConflictUserErr('Аккаунт с данным email зарегистрирован'));
      } else if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => { throw new NotAuthError('Неправильные почта или пароль'); })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw NotAuthError('Неправильные почта или пароль');
        }
        return user;
      }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
