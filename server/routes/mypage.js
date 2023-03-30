const express = require('express');
const router = express.Router();
const { mypage } = require('../controllers/mypage');
const { isLoggedIn } = require('../middlewares');

router.get('/', isLoggedIn, mypage);

module.exports = router;
