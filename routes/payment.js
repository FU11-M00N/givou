const express = require('express');
const router = express.Router();

const { paymentWebhook, paymentAmount } = require('../controllers/payment');

router.post('/portoneWebhook', paymentWebhook);

router.post('/paymentAmount', paymentAmount);

module.exports = router;
