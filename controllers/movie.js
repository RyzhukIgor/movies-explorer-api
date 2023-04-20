const Movie = require('../models/movie');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrBadRequest = require('../errors/ErrorBadRequest');
const ForBiddenErr = require('../errors/ForBiddenErr');

const { STATUS_CREATED } = require('../errors/errors');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch((error) => next(error));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      throw new ErrorNotFound('фильм не найден');
    })
    .then((movie) => {
      const owner = movie.owner.id;
      if (owner.toString() !== req.user._id) {
        next(new ForBiddenErr('У вас нет доступа к удалению этого фильма'));
      }
      return Movie.findByIdAndDelete(movieId)
        .then(() => {
          res.send({ message: 'Фильм удален' });
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};
