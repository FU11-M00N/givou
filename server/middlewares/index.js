const User = require('../models/user');

exports.isLoggedIn = (req, res, next) => {
   //isAuthenticated 로그인 상태 시 ture 반환
   if (req.isAuthenticated()) {
      next();
   } else {
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
   if (req.isAuthenticated()) {
      const loginUser = { email: req.user.email, nick: req.user.nick, provider: req.user.provider };
      return res.status(200).json({ loginUser });
   } else {
      return res.stauts(403).send('올바른 접근이 아닙니다.');
   }
};
