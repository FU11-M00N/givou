const User = require('../models/user');

exports.isLoggedIn = (req, res, next) => {
   //isAuthenticated 로그인 상태 시 ture 반환
   if (req.isAuthenticated()) {
      next();
   } else {
      console.log('test2');
      res.status(403).json('로그인 필요');
   }
};

exports.isNotLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      next();
   } else {
      const message = encodeURIComponent('로그인한 상태입니다.');

      res.redirect(`/?error=${message}`);
   }
};

exports.auth = (req, res, next) => {
   const loginUser = { email: user.email, nick: user.nick, provider: user.provider };

   return res.status(200).json({ loginUser });

   console.log('유저 테스트', req.user);
   res.status(200).json(req.user);
};
