const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { paymentWebhook, paymentAmount } = require('../controllers/payment');

router.post('/portoneWebhook', paymentWebhook);

router.post('/paymentAmount', isLoggedIn, paymentAmount);

module.exports = router;
