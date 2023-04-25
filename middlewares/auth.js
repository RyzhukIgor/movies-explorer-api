const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const {
  MOVIE_AUTH_REQ,
} = require('../utils/constants');

const { JWT_SECRET } = require('../utils/configurations');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthError(MOVIE_AUTH_REQ));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError(MOVIE_AUTH_REQ));
    return;
  }

  req.user = payload;

  next();
};
