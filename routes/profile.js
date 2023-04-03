const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profile');

router.get('/:nick', getProfile);

module.exports = router;
