const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const User = require('../models/users');

const { STATUS_OK } = require('../errors/errors');

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
