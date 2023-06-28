const express = require('express');
const router = express.Router();

const { resetPwd, findId } = require('../controllers/user');

const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const redis = require('redis');
const crypto = require('crypto-js');
const axios = require('axios');

const randomBytes = require('crypto').randomBytes(3);

// async function emailCheck(email, errors) {}
async function emailDuplicateCheck(email, errors) {
   const user = await User.findOne({
      where: { email },
   });

   if (user) {
      errors.email = '중복된 이메일 입니다.';
   }
}

function emailRegexCheck(email, errors) {
   const regex = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
   if (!regex.test(email)) {
      errors.email = '이메일 형식이 올바르지 않습니다.';
   }
   if (email.length >= 40) {
      errors.email = '이메일 길이가 초과되었습니다.';
   }
}

// select nick from user where = req.nick
exports.nickCheck = async (nick, errors) => {
   const regex = /^(?=.*[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9])[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{2,}$/;
   if (!regex.test(nick)) {
      errors.nick = '한글, 영문, 숫자를 포함한 2글자 이상으로 작성해 주시기 바랍니다.';
   }
   if (nick.length === 0) {
      errors.nick = '한글, 영문, 숫자를 포함한 2글자 이상으로 작성해 주시기 바랍니다.';
   }
   const user = await User.findOne({
      where: { nick },
   });

   if (user) {
      errors.nick = '중복된 닉네임입니다.';
   }

   if (nick.length >= 15) {
      errors.nick = '닉네임 길이가 초과되었습니다.';
   }
};

function passwordCheck(password, errors) {
   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
   if (!regex.test(password)) {
      errors.password = '패스워드는 대소문자 1자 이상, 숫자 1자, 특수문자 1자 이상으로 8자 이상 작성해주시기 바랍니다.';
   }
   if (password.length >= 15) {
      errors.password = '패스워드는 최소 8자 최대 15자로 작성해주시기 바랍니다.';
   }
}

function phoneNumRegexCheck(phoneNum, errors) {
   const regex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
   if (!regex.test(phoneNum)) {
      errors.phoneNum = '전화번호 형식이 일치하지 않습니다.';
   }
}
exports.phoneNumDuplicateCheck = async (phoneNum, errors) => {
   const user = await User.findOne({
      where: { phoneNum },
   });
   if (user) {
      errors.phoneNum = '중복된 전화번호입니다.';
   }
};

exports.bioCheck = (bio, errors) => {
   if (bio.length > 500) {
      errors.bio = '상태 메시지는 500자 이내로 작성해 주시기 바랍니다.';
   }
};

exports.joinVrfct = async (req, res) => {
   try {
      const { email, nick, password, phoneNum, bio } = req.body;
      const errors = {};
      if (email || email === '') {
         emailRegexCheck(email, errors);
         await emailDuplicateCheck(email, errors);
      }
      if (password || password === '') {
         passwordCheck(password, errors);
      }
      if (phoneNum || phoneNum === '') {
         phoneNumRegexCheck(phoneNum, errors);
         await this.phoneNumDuplicateCheck(phoneNum, errors);
      }
      if (nick || nick === '') {
         await this.nickCheck(nick, errors);
      }
      if (bio) {
         this.bioCheck(bio, errors);
      }

      if (Object.keys(errors).length === 0) {
         res.status(200).send('success');
      } else {
         res.status(400).json(errors);
      }
   } catch (error) {
      console.error(error);
   }
};

exports.join = async (email, nick, password, phoneNum) => {
   try {
      const errors = {};
      emailRegexCheck(email, errors);
      await emailDuplicateCheck(email, errors);

      await this.nickCheck(nick, errors);

      phoneNumRegexCheck(phoneNum, errors);
      await this.phoneNumDuplicateCheck(phoneNum, errors);

      if (Object.keys(errors).length === 0) {
         const hash = await bcrypt.hash(password, 12);
         await User.create({
            email,
            nick,
            password: hash,
            phoneNum,
         });
         return null;
      } else {
         return errors;
      }
   } catch (error) {
      console.error(error);
   }
};

//* 로그인 요청
// 사용자 미들웨어 isNotLoggedIn 통과해야 async (req, res, next) => 미들웨어 실행
exports.login = async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      //? (authError, user, info) => localstrategy에서 done()이 호출되면 실행된다.
      //? localstrategy에 done()함수에 로직 처리에 따라 1,2,3번째 인자에 넣는 순서가 다름.

      // done(err)가 처리 된 경우
      if (authError) {
         console.error(authError);
         return next(authError);
      }
      if (!user) {
         console.log(info);
         return res.status(400).json(info);
      }
      // done(null, exUser)가 처리 된 경우(로그인 성공) passport/index.js로 가서 실행
      return req.login(user, loginError => {
         if (loginError) {
            console.error(loginError);
            return next(loginError);
         }

         const loginUser = {
            email: user.email,
            nick: user.nick,
            provider: user.provider,
            bio: user.bio,
            point: user.point,
         };

         return res.status(200).json({ loginUser });
      });
   })(req, res, next);
};

exports.logout = (req, res) => {
   req.logout(() => {
      res.redirect('https://www.givou.site/');
   });
};

exports.certificate = async (req, res, next) => {
   try {
      const client = await RedisConnect();
      const { email, phoneNum } = req.body;

      const errors = {};

      if (email) {
         emailRegexCheck(email, errors);
         if (Object.keys(errors).length === 0) {
            const user = await User.findOne({ where: { email } });
            const certiCode = parseInt(randomBytes.toString('hex'), 16); // 인증번호 생성
            await saveAuthCode(user.phoneNum, certiCode, client); // 인증번호 레디스 저장
            // await sendMessageService(user.phoneNum, certiCode); // 인증문자 전송
            res.status(200).send('success');
         } else {
            res.status(400).json(errors);
         }
      } else {
         phoneNumRegexCheck(phoneNum, errors);
         if (Object.keys(errors).length === 0) {
            const certiCode = parseInt(randomBytes.toString('hex'), 16); // 인증번호 생성
            await saveAuthCode(phoneNum, certiCode, client); // 인증번호 레디스 저장
            // await sendMessageService(phoneNum, certiCode); // 인증문자 전송
            res.status(200).send('success');
         } else {
            res.status(400).json(errors);
         }
      }
   } catch (error) {
      console.error(error);
   }
};

async function RedisConnect() {
   let client;
   try {
      client = redis.createClient({
         socket: {
            port: 6379,
            host: '13.124.83.112',
         },
      });
      await client.connect();

      return client;
   } catch (error) {
      console.error(error);
   }
}

async function saveAuthCode(phoneNum, certiCode, client) {
   try {
      await client.set(phoneNum, certiCode, { EX: 180 });
   } catch (error) {
      console.error(error);
   }
}

async function sendMessageService(phoneNum, certiCode) {
   try {
      const serviceId = process.env.NAVER_SERVICE_ID;
      const accessKey = process.env.NAVER_ACCESS_KEY;
      const secretKey = process.env.NAVER_SECRET_KEY;
      const timestamp = Date.now() + '';

      // url 관련 변수 선언
      const method = 'POST';
      const space = ' ';
      const newLine = '\n';
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
      const url2 = `/sms/v2/services/${serviceId}/messages`;

      const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);

      hmac.update(method);
      hmac.update(space);
      hmac.update(url2);
      hmac.update(newLine);
      hmac.update(timestamp);
      hmac.update(newLine);
      hmac.update(accessKey);

      const hash = hmac.finalize();
      const signature = hash.toString(crypto.enc.Base64);

      axios({
         method: method,
         json: true,
         url: url,
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature,
         },
         data: {
            type: 'SMS',
            contentType: 'COMM',
            countryCode: '82',
            from: '01052190235',
            content: certiCode,
            messages: [
               {
                  to: phoneNum,
               },
            ],
         },
      });
   } catch (error) {
      console.error(error);
   }
}
exports.compareAuthCode = async (req, res) => {
   try {
      // select email from user where phoneNumber = phoneNumber
      const { clientCode, phoneNum, type, email, nick, password } = req.body;

      const client = await RedisConnect();

      if (type === 'password') {
         const user = await User.findOne({
            where: { email },
         });
         const result = parseInt(await client.get(user.phoneNum), 10);
         if (parseInt(clientCode, 10) === result) {
            await resetPwd(email);
            res.status(200).json('패스워드 초기화 완료');
         } else {
            res.status(400).json({ authCode: '인증번호 불일치' });
         }
      } else if (type === 'id') {
         const result = parseInt(await client.get(phoneNum), 10);
         if (parseInt(clientCode, 10) === result) {
            const userId = await findId(phoneNum);
            res.status(200).json(userId);
         } else {
            res.status(400).json({ authCode: '인증번호 불일치' });
         }
      } else if (type === 'join') {
         console.log('test');
         const result = parseInt(await client.get(phoneNum), 10);
         if (parseInt(clientCode, 10) === result) {
            const errors = await this.join(email, nick, password, phoneNum);
            if (!errors) {
               res.status(200).json('회원가입 완료');
            } else {
               res.status(400).json(errors);
            }
         } else {
            res.status(400).json({ authCode: '인증번호 불일치' });
         }
      }
   } catch (error) {
      console.error(error);
   }
};
