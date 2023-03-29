const User = require('../models/user');

exports.mypage = async (req, res, next) => {
   User.findOne({
      where: { nick: req.body.nick },
   });
};
