const { sequelize } = require('../models');
const Subs = require('../models/subs');
const Post = require('../models/post');
const User = require('../models/user');
const Sequelize = require('sequelize');

exports.getSub = async (req, res, next) => {
   try {
      // 해당 subs의 데이터와 subs의 게시물들

      const subs = await Subs.findOne({
         where: { name: req.params.name },
         raw: true,
      });
      console.log(subs.id);

      // id, title, hit, createAt, 글쓴사람 닉네임
      // 오늘 이면 시간 : 분
      // 다른날이면 월 . 일

      // select
      //    case substring(NOW(),'6','6')
      //    when substring(createdAt,'6','6')
      //    then substring(createdAt, '12', '5')
      //    else substring(createdAt, '1', '10')
      // END as 'createdAt'
      // from posts;

      const posts = await Post.findAll({
         include: {
            model: User,
            require: false,
            attributes: ['nick'],
         },

         attributes: [
            'id',
            'title',
            'hit',
            'UserId',
            [
               Sequelize.literal(
                  ` CASE substring(NOW(), '6', '6') WHEN substring(Post.createdAt, '6','6') THEN substring(Post.createdAt, '12', '5') else substring(Post.createdAt, '1', '10') END`,
               ),
               'createdAt',
            ],
         ],

         raw: true,
      });

      console.log(posts);

      const subsImage = subs.imageUrn;
      const bannerImage = subs.bannerUrn;
      const baseUrl = 'http://givou.site:7010/img/';

      subs.imageUrl = baseUrl + subsImage;
      subs.bannerUrl = baseUrl + bannerImage;

      delete subs.imageUrn;
      delete subs.bannerUrn;

      res.status(200).json({ subs, posts });
   } catch (error) {
      console.error(error);
   }
};

exports.RandSubs = async (req, res) => {
   try {
      // select name, title, imageUrn from subs order by RAND() Limit 5
      const RandSubs = await Subs.findAll({
         attributes: ['name', 'title', ['imageUrn', 'imageUrl'], ['bannerUrn', 'bannerUrl']],
         order: sequelize.random(),
         limit: 5,
         raw: true,
      });

      const baseUrl = 'http://givou.site:7010/img/';

      for (let i = 0; i < 2; i++) {
         RandSubs[i].imageUrl = baseUrl + RandSubs[i].imageUrl;
         RandSubs[i].bannerUrl = baseUrl + RandSubs[i].bannerUrl;
         console.log(RandSubs[i]);
      }

      res.status(200).json(RandSubs);
   } catch (error) {
      console.error(error);
   }
};

exports.uploadImage = async (req, res) => {
   try {
      if (req.body.key === 'image') {
         console.log('test');
         await Subs.update(
            {
               imageUrn: req.file.filename,
            },
            { where: { name: req.params.subsName } },
         );
      } else {
         await Subs.update(
            {
               bannerUrn: req.file.filename,
            },
            { where: { name: req.params.subsName } },
         );
      }
      res.send('success');
   } catch (error) {
      console.error(error);
   }
};

exports.uploadSubs = async (req, res) => {
   try {
      const subs = await Subs.create({
         name: req.body.name,
         title: req.body.title,
         description: req.body.description,
      });
      res.status(200).json({ name: subs.name });
   } catch (error) {
      console.error(error);
   }
};
