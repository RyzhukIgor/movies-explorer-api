const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.post('/signup', createUser);
router.post('/signin', login);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница по данному маршруту не найдена'));
});

module.exports = router;
