const User = require('../models/user');

exports.mypage = async (req, res, next) => {
   try {
      const user = await User.findOne({
         where: { nick: req.user.nick },
      });
      res.status(200);
   } catch (error) {
      console.error(error);
   }
};
