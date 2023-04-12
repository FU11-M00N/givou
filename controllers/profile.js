const Sequelize = require('sequelize');
const User = require('../models/user');

exports.getProfile = async (req, res, next) => {
   // nick, imgurl
   try {
      const user = await User.findOne({
         where: { nick: req.params.nick },
      });
      console.log(user);
      res.status('200').json({ nick: user.nick, imageUrn: user.imageUrn, imageUrn: user.bannerUrn });
   } catch (error) {
      console.error(error);
   }
};

exports.uploadImage = async (req, res, next) => {
   try {
      console.log(req.user);
      await User.update(
         {
            imageUrn: req.file.filename,
         },
         { where: { id: req.user.id } },
      );
      res.status(200).send('success');
   } catch (error) {
      console.error(error);
   }
};

exports.uploadBanner = async (req, res, next) => {
   try {
      await User.update(
         {
            bannerUrn: req.file.filename,
         },
         { where: { id: req.user.id } },
      );
      res.status(200).send('success');
   } catch (error) {
      console.error(error);
   }
};

exports.uploadBio = async (req, res, next) => {
   try {
      await User.update(
         {
            bio: req.body.bio,
         },
         { where: { id: req.user.id } },
      );
      res.status(200).send('success');
   } catch (error) {
      console.error(error);
   }
};
