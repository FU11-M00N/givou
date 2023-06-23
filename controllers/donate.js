const User = require('../models/user');
const Subs = require('../models/subs');
const { Sequelize } = require('sequelize');

exports.donateSubs = async (req, res) => {
   try {
      // 프론트엔드와 상의 후 기능 추가 필요
      const subs = await Subs.findOne({
         where: { name: req.params.subId },
      });

      const user = await User.findOne({
         where: { id: req.user.id },
         attributes: ['point'],
      });
      console.log(user.dataValues.point);

      if (user.dataValues.point >= req.body.point) {
         await Subs.update(
            {
               totalPoint: req.body.point,
            },
            {
               where: { id: subs.id },
            },
         );
         await User.update(
            {
               point: Sequelize.literal(`point - ${req.body.point}`),
            },
            { where: { id: req.user.id } },
         );
         res.status(200).send('success');
      } else {
         console.log('금액 부족');
         res.status(400).send('금액 부족');
      }
   } catch (error) {
      console.error(error);
   }
};
