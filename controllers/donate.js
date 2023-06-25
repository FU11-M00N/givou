const User = require('../models/user');
const Subs = require('../models/subs');
const Donate = require('../models/donate');

const { Sequelize } = require('sequelize');

exports.donateSubs = async (req, res) => {
   try {
      const subs = await Subs.findOne({
         where: { name: req.params.subId },
      });

      const user = await User.findOne({
         where: { id: req.user.id },
         attributes: ['point'],
      });

      if (user.dataValues.point >= req.body.point) {
         await Donate.create({
            point: req.body.point,
            UserId: req.user.id,
            SubId: subs.id,
         });
         await Subs.update(
            {
               totalPoint: Sequelize.literal(`totalPoint + ${req.body.point}`),
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
         res.status(400).send('금액 부족');
      }
   } catch (error) {
      console.error(error);
   }
};
