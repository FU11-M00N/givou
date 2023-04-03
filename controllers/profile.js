const Sequelize = require('sequelize');
const User = require('../models/user');

exports.getProfile = async (req, res, next) => {
   // nick, imgurl
   try {
      const user = await User.findOne({
         where: { nick: req.params.nick },
      });
      console.log(user);
      res.status('200').json({ nick: user.nick, imageUrn: user.imageUrn });
   } catch (error) {
      console.error(error);
   }
};
