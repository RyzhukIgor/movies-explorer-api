const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');

const { JWT_SECRET } = require('../utils/configurations');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
