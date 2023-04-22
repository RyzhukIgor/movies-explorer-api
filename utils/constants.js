const PATTERN_VALID = /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i;

const USER_NOT_FOUND_MESSAGE = 'Пользователь не найден';
const USER_ACCOUNT_ALREADY_EXISTS = 'Аккаунт с данным email уже зарегистрирован';
const USER_INCORRECT_DATA = 'Переданы некорректные данные';
const INCORRECT_EMAIL_OR_PASSWORD = 'Неверные почта или пароль';
const MOVIE_NOT_FOUND = 'Указанный фильм не найден';
const MOVIE_ACCESS_FAIL = 'У вас нет доступа к удалению этого фильма';
const MOVIE_AUTH_REQ = 'Необходима авторизация';
const ROUTE_NOT_FOUND = 'Страница по данному маршруту не найдена';

module.exports = {
  PATTERN_VALID,
  USER_NOT_FOUND_MESSAGE,
  USER_ACCOUNT_ALREADY_EXISTS,
  USER_INCORRECT_DATA,
  INCORRECT_EMAIL_OR_PASSWORD,
  MOVIE_NOT_FOUND,
  MOVIE_ACCESS_FAIL,
  MOVIE_AUTH_REQ,
  ROUTE_NOT_FOUND,
};
