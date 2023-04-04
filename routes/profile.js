const express = require('express');
const router = express.Router();
const { getProfile, uploadImage, uploadBanner, uploadBio } = require('../controllers/profile');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

try {
   fs.readdirSync('uploadsProfileImage');
} catch (error) {
   console.error('uploadsProfileImage 폴더 생성');
   fs.mkdirSync('uploadsProfileImage');
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
         done(null, 'uploadsProfileImage');
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

router.get('/:nick', getProfile);
router.post('/image', upload.single('file'), uploadImage);
router.post('/banner', upload.single('file'), uploadBanner);
router.post('/bio', uploadBio);

module.exports = router;
