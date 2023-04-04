const express = require('express');
const router = express.Router();
const { mypage } = require('../controllers/mypage');
const { isLoggedIn } = require('../middlewares');
const { uploadImage } = require('../controllers/upload');
const multer = require('multer');

router.get('/', isLoggedIn, mypage);
router.post('/image', uploadImage);

module.exports = router;
