const express = require('express');

const router = express.Router();

const { isLoggedIn } = require('../middlewares');

router.post('/');

module.exports = router;
