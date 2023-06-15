const axios = require('axios');

exports.payment = async (req, res) => {
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

      console.log('테스트~', access_token);
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
      console.log(paymentData);
      //   // DB에서 결제되어야 하는 금액 조회
      //   const order = await Orders.findById(paymentData.merchant_uid);
      //   const amountToBePaid = order.amount; // 결제 되어야 하는 금액

      //   // 결제 검증하기
      //   const { amount, status } = paymentData;
      //   // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
   } catch (error) {
      console.log(error);
   }
};
