const express = require('express');

const router = express.Router();

const { donateSubs } = require('../controllers/donate');

const { isLoggedIn } = require('../middlewares');

router.post('/:subId', isLoggedIn, donateSubs);

module.exports = router;
