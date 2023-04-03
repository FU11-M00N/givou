const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { resetPwd, updateNick, updateEmail } = require('../controllers/user');

router.patch('/password', resetPwd);
router.patch('/nick', updateNick);
router.patch('/email', updateEmail);

module.exports = router;
