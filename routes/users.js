const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/user');

router.get('/me', getUserInfo);
router.patch('/me', updateUserInfo);

module.exports = router;
