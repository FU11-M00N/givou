const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../middlewares');
const { uploadImage, uploadSubs, RandSubs } = require('../controllers/subs');

const router = express.Router();

try {
   fs.readdirSync('uploadsSubs');
} catch (error) {
   console.error('uploads 폴더 생성');
   fs.mkdirSync('uploadsSubs');
}

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpeg') {
      cb(null, true); // 해당 mimetype 만 허용
   } else {
      req.fileValidationError = 'jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.';
      cb(null, false);
   }
};

const upload = multer({
   storage: multer.diskStorage({
      //폴더 경로 지정
      destination: (req, file, done) => {
         done(null, 'uploadsSubs/');
      },
      filename: (req, file, done) => {
         const ext = path.extname(file.originalname);
         const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
         done(null, fileName);
      },
   }),
   fileFilter: fileFilter,
   limits: { fileSize: 30 * 1024 * 1024 },
});

router.get('/', RandSubs);
router.post('/', uploadSubs);
router.post('/:subsName/img', upload.single('file'), uploadImage);

// const upload2 = multer();
// router.post('/', upload2.none(), uploadImage);

module.exports = router;
