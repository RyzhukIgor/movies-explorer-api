const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/user');
const { updateUserValidate } = require('../middlewares/validation');

router.get('/me', getUserInfo);
router.patch('/me', updateUserValidate, updateUserInfo);

module.exports = router;
