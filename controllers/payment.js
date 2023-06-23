const axios = require('axios');

const User = require('../models/user');
const Payment = require('../models/payment');

const Sequelize = require('sequelize');

exports.getPaymentUser = async (req, res) => {
   try {
      const user = { phoneNum: req.user.phoneNum, nick: req.user.nick, email: req.user.email };
      res.status(200).json(user);
   } catch (error) {
      console.error(error);
   }
};

exports.paymentWebhook = async (req, res) => {
   try {
      // req의 body에서 imp_uid, merchant_uid 추출
      const { imp_uid, merchant_uid } = req.body;

      // 액세스 토큰(access token) 발급 받기
      const getToken = await axios({
         url: 'https://api.iamport.kr/users/getToken',
         method: 'post', // POST method
         headers: { 'Content-Type': 'application/json' },
         data: {
            imp_key: process.env.PORTONE_API_KEY, // REST API 키
            imp_secret: process.env.PORTONE_API_SECRET, // REST API Secret
         },
      });
      const access_token = getToken.data.response.access_token;

      // imp_uid로 포트원 서버에서 결제 정보 조회
      const getPaymentData = await axios({
         // imp_uid 전달
         url: `https://api.iamport.kr/payments/${imp_uid}`,
         // GET method
         method: 'get',
         // 인증 토큰 Authorization header에 추가
         headers: { Authorization: access_token },
      });

      const paymentData = getPaymentData.data; // 조회한 결제 정보

      // DB에서 결제되어야 하는 금액 조회
      const order = await Payment.findOne({
         where: { merchantUid: merchant_uid },
      });

      const amountToBePaid = order.amount; // 결제 되어야 하는 금액

      // 결제 검증하기
      const { amount, status } = paymentData.response;
      // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액

      if (amount === amountToBePaid) {
         await Payment.update(
            {
               paymentVrfct: true,
            },
            {
               where: { id: order.id },
            },
         );
      } else {
         res.status(400).json({ status: 'forgery', message: '위조된 결제시도' });
      }
      const payment = await Payment.findOne({
         where: { id: order.id },
      });

      if (payment.paymentVrfct) {
         await User.update(
            {
               point: Sequelize.literal(`point + ${amount}`),
            },
            { where: { id: order.UserId } },
         );
         res.status(200).json({ status: 'success', message: '일반 결제 성공' });
      }
   } catch (error) {
      console.log(error);
   }
};

exports.paymentAmount = async (req, res) => {
   try {
      const user = await User.findOne({
         where: { id: req.user.id },
      });
      if (user) {
         await Payment.create({
            payMethod: req.body.pay_method,
            merchantUid: req.body.merchant_uid,
            name: req.body.name,
            amount: req.body.amount,
            buyerEmail: req.body.buyer_email,
            buyerName: req.body.buyer_name,
            buyerTel: req.body.buyer_tel,
            UserId: req.user.id,
         });
         res.status(200).send('success');
      } else {
         res.stauts(400).send('올바른 접근이 아닙니다.');
      }
   } catch (error) {
      console.error(error);
   }
};
