const router = require('express').Router();
const { createUser, login } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { signUpValidate, signInValidate } = require('../middlewares/validation');

router.post('/signup', signUpValidate, createUser);
router.post('/signin', signInValidate, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница по данному маршруту не найдена'));
});

module.exports = router;
