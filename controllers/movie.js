const Movie = require('../models/movie');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrBadRequest = require('../errors/ErrorBadRequest');
const ForBiddenErr = require('../errors/ForBiddenErr');
const {
  USER_INCORRECT_DATA,
  MOVIE_NOT_FOUND,
  MOVIE_ACCESS_FAIL,
} = require('../utils/constants');
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
        next(new ErrBadRequest(USER_INCORRECT_DATA));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      throw new ErrorNotFound(MOVIE_NOT_FOUND);
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (owner === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send({ message: 'Фильм удален' });
          })
          .catch(next);
      } else {
        throw new ForBiddenErr(MOVIE_ACCESS_FAIL);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrBadRequest(USER_INCORRECT_DATA));
      } else {
        next(error);
      }
    });
};
