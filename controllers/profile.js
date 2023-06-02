const Sequelize = require('sequelize');
const User = require('../models/user');
const Post = require('../models/post');
const Subs = require('../models/subs');
//TODO: 유저 배너 이미지, 유너 프로필 이미지, 유저 bio, 유저가 작성 한 게시글, 댓글,

exports.getProfile = async (req, res, next) => {
   // nick, imgurl
   try {
      const user = await User.findOne({
         include: [
            {
               model: Post,
               required: true,
               attributes: ['id', 'title'],
            },
            {
               model: Subs,
               required: true,
               attributes: ['id', 'title', 'imageUrn'],
            },
         ],
         attributes: [
            'id',
            'email',
            'nick',
            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('imageUrn')), 'imageUrl'],
            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('bannerUrn')), 'bannerUrl'],
            'bio',
            'createdAt',
         ],
         where: { nick: req.params.nick },
      });

      console.log(user.dataValues.Subs);

      res.status('200').json({ user });
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
