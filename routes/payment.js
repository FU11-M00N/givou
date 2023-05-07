const express = require('express');
const router = express.Router();

const { payment } = require('../controllers/payment');

router.post('/portone-webhook', payment);

module.exports = router;
