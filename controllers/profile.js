const Sequelize = require('sequelize');
const User = require('../models/user');
const Post = require('../models/post');
const Subs = require('../models/subs');
const Comment = require('../models/comment');
const { nickCheck, bioCheck } = require('./auth');

exports.getProfile = async (req, res, next) => {
   // nick, imgurl
   try {
      const user = await User.findOne({
         include: [
            {
               model: Post,
               separate: true,
               attributes: ['id', 'title'],
               order: [['createdAt', 'DESC']],
               include: [
                  {
                     model: Subs,
                     attributes: [
                        'id',
                        'title',
                        'name',
                        [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('imageUrn')), 'imageUrl'],
                     ],
                  },
               ],
            },
            {
               model: Comment,

               attributes: [
                  'id',
                  'content',
                  'order',
                  [
                     Sequelize.literal(` 
               CASE
                  WHEN TIMESTAMPDIFF(SECOND, Comment.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, Comment.createdAt, NOW()), '초 전')
                  WHEN TIMESTAMPDIFF(MINUTE, Comment.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, Comment.createdAt, NOW()), '분 전')
                  WHEN TIMESTAMPDIFF(HOUR, Comment.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, Comment.createdAt, NOW()), '시간 전')
                  WHEN TIMESTAMPDIFF(DAY, Comment.createdAt, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, Comment.createdAt, NOW()), '일 전')
                  WHEN TIMESTAMPDIFF(MONTH, Comment.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, Comment.createdAt, NOW()), '달 전')
                  ELSE CONCAT(TIMESTAMPDIFF(YEAR, Comment.createdAt, NOW()), '년 전')
           END`),
                     'ago',
                  ],
                  'createdAt',
               ],
               separate: true,
               order: [['createdAt', 'DESC']],
               include: [
                  {
                     model: Post,
                     attributes: ['id', 'title'],
                  },
               ],
            },
         ],
         attributes: [
            'id',
            'nick',

            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('User.imageUrn')), 'imageUrl'],
            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('User.bannerUrn')), 'bannerUrl'],
            'bio',
            'createdAt',
            'email',
         ],
         where: { nick: req.params.nick },
      });

      if (req.query.all === 'Y') {
         res.status(200).json({ user });
      } else {
         delete user.dataValues.Posts;
         delete user.dataValues.Comments;
         res.status(200).json({ user });
      }
   } catch (error) {
      console.error(error);
   }
};

exports.uploadImage = async (req, res, next) => {
   try {
      const user = User.findOne({
         where: { id: req.user.id },
      });
      if (user) {
         await User.update(
            {
               imageUrn: req.file.filename,
            },
            { where: { id: req.user.id } },
         );
         res.status(200).send('success');
      } else {
         res.status(400).send('올바르지 않은 접근 방식');
      }
   } catch (error) {
      console.error(error);
   }
};

exports.uploadBanner = async (req, res, next) => {
   try {
      const user = User.findOne({
         where: { id: req.user.id },
      });
      if (user) {
         await User.update(
            {
               bannerUrn: req.file.filename,
            },
            { where: { id: req.user.id } },
         );
         res.status(200).send('success');
      } else {
         res.status(400).send('올바르지 않은 접근 방식');
      }
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

exports.updateProfile = async (req, res) => {
   try {
      const { nick, bio } = req.body;
      const errors = {};
      if (nick || nick === '') {
         await nickCheck(nick, errors);
      }
      if (bio) {
         bioCheck(bio, errors);
      }

      if (Object.keys(errors).length === 0) {
         const user = await User.findOne({
            where: { id: req.user.id },
         });
         if (user) {
            await User.update(
               {
                  nick,
                  bio,
               },
               {
                  where: { id: req.user.id },
               },
            );
            res.status(200).send('success');
         } else {
            res.status(400).send('올바르지 않은 접근 방식');
         }
      } else {
         res.status(400).json(errors);
      }
   } catch (error) {
      console.error(error);
   }
};
