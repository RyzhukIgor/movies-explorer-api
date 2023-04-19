const router = require('express').Router();
const { updateUserInfo, getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', updateUserInfo);

module.exports = router;
