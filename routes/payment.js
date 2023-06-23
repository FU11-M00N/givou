const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { paymentWebhook, paymentAmount, getPaymentUser } = require('../controllers/payment');

router.get('/getPaymentUser', isLoggedIn, getPaymentUser);

router.post('/portoneWebhook', paymentWebhook);
router.post('/paymentAmount', isLoggedIn, paymentAmount);

module.exports = router;
