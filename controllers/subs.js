const { sequelize } = require('../models');
const Subs = require('../models/subs');
const Post = require('../models/post');
const User = require('../models/user');
const db = require('../models');
const { Subslike } = db.sequelize.models;
const Sequelize = require('sequelize');

exports.getSub = async (req, res) => {
   try {
      // 해당 subs의 데이터와 subs의 게시물들

      //  ------------------------
      // subs 작성일 요구사항 및 query
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
      //  ------------------------

      //  ------------------------
      // N:M join 불가능으로 인한 sequelize 미사용

      // const posts = await Post.findAll({
      //    include: [
      //       {
      //          model: Subs,
      //          require: true,
      //          attributes: [],
      //          where: {
      //             name: req.params.name,
      //          },
      //       },
      //       {
      //          model: User,
      //          require: true,
      //          attributes: [],
      //       },
      //       {
      //          model: PostLike,
      //          as: 'Liker',
      //          require: true,
      //          attributes: [],
      //       },
      //    ],
      //    attributes: [
      //       'id',
      //       'title',
      //       'hit',
      //       'UserId',
      //       'User.nick',
      //       [
      //          Sequelize.literal(
      //             ` CASE substring(NOW(), '6', '6') WHEN substring(Post.createdAt, '6','6') THEN substring(Post.createdAt, '12', '5') else substring(Post.createdAt, '1', '10') END`,
      //          ),
      //          'createdAt',
      //       ],
      //       [db.sequelize.fn('count', db.sequelize.col('PostLike.PostId')), '좋아요 수'],

      //       [Sequelize.fn('count', 'User.id'), 'likeCount'],
      //    ],
      //    group: ['Post.id'],
      //    raw: true,
      // });
      //  ------------------------

      // raw query 사용
      const query = `SELECT Post.id, Post.title, Post.hit, Post.UserId, User.nick, count(PostLike.PostId) as 'likeCount' ,CASE substring(NOW(), '6', '6') 
		WHEN substring(Post.createdAt, '6','6')
         THEN substring(Post.createdAt, '12', '5')
        else substring(Post.createdAt, '1', '10') END AS createdAt FROM posts AS Post
        LEFT OUTER JOIN user AS User ON Post.UserId = User.id AND (User.deletedAt IS NULL)
         INNER JOIN subs AS Sub ON Post.SubId = Sub.id AND (Sub.deletedAt IS NULL AND Sub.name = '${req.params.name}')
         LEFT OUTER JOIN PostLike ON PostLike.PostId = Post.id
         WHERE (Post.deletedAt IS NULL)
         group by (PostLike.PostId), Post.Id;
          `;

      const posts = await sequelize.query(query, {
         type: sequelize.QueryTypes.SELECT,
      });

      const subs = await Subs.findOne({
         where: { name: req.params.name },
      });

      const likeCount = await subs.getSubsLiker().then(res => {
         return res.length;
      });

      if (req.user) {
         const isLike = await subs.getSubsLiker({
            where: { id: req.user.id },
         });
         subs.dataValues.isLike = isLike.length ? true : false;
      } else {
         subs.dataValues.isLike = false;
      }
      subs.dataValues.likeCount = likeCount;

      const subsImage = subs.dataValues.imageUrn;
      const bannerImage = subs.dataValues.bannerUrn;
      const baseUrl = 'http://givou.site:7010/img/';

      subs.dataValues.imageUrl = baseUrl + subsImage;
      subs.dataValues.bannerUrl = baseUrl + bannerImage;

      delete subs.dataValues.imageUrn;
      delete subs.dataValues.bannerUrn;

      res.status(200).json({ subs, posts });
   } catch (error) {
      console.error(error);
   }
};

exports.RandSubs = async (req, res) => {
   try {
      // select name, title, imageUrn from subs order by RAND() Limit 5
      const RandSubs = await Subs.findAll({
         attributes: [
            'name',
            'title',
            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('Subs.imageUrn')), 'imageUrl'],
            [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('Subs.bannerUrn')), 'bannerUrl'],
         ],
         order: sequelize.random(),
         limit: 5,
         raw: true,
      });

      // const baseUrl = 'http://givou.site:7010/img/';

      // for (let i = 0; i < 3; i++) {
      //    RandSubs[i].imageUrl = baseUrl + RandSubs[i].imageUrl;
      //    RandSubs[i].bannerUrl = baseUrl + RandSubs[i].bannerUrl;
      //    console.log(RandSubs[i]);
      // }

      res.status(200).json(RandSubs);
   } catch (error) {
      console.error(error);
   }
};

exports.uploadImage = async (req, res) => {
   try {
      if (req.body.key === 'image') {
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

async function subsNameCheck(name, errors) {
   const subs = await Subs.findOne({
      where: { name },
   });
   if (subs) {
      errors.name = '이미 생성된 sub name 입니다.';
      return false;
   }
   return true;
}

async function subsTitleCheck(title, errors) {
   const subs = await Subs.findOne({
      where: { title },
   });

   if (subs) {
      errors.title = '이미 생성된 subs title 입니다.';
      return false;
   }
   return true;
}

exports.uploadSubs = async (req, res) => {
   try {
      const errors = {};
      const { name, title } = req.body;
      const subsNameTF = await subsNameCheck(name, errors);
      const subsTitleTF = await subsTitleCheck(title, errors);

      if (subsNameTF && subsTitleTF) {
         const subs = await Subs.create({
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
         });
         res.status(200).json({ name: subs.name });
      } else {
         res.status(400).json({ errors });
      }
   } catch (error) {
      console.error(error);
   }
};

exports.updateSubs = async (req, res) => {
   try {
      const errors = {};
      const { title } = req.body;

      const subsTitleTF = await subsTitleCheck(title, errors);

      if (subsTitleTF) {
         Subs.update(
            {
               title: req.body.title,
               description: req.body.description,
            },
            {
               where: { id: req.params.subId },
            },
         );
         res.status(200).send('success');
      } else {
         res.status(400).json({ errors });
      }
   } catch (error) {
      console.error(error);
   }
};

exports.deleteSubs = async (req, res) => {
   try {
      if (req.user.id === 1) {
         // user id 1번 (어드민) 임시 하드코딩
         await Subs.destroy({
            where: { id: req.params.subId },
         });
         res.status(200).send('subs 삭제 완료');
      } else {
         res.status(403).send('허용되지 않은 사용자입니다.');
      }
   } catch (error) {
      console.error(error);
   }
};

exports.likeSubs = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      await user.addSubsLiked(parseInt(req.params.id, 10));
      res.send('success');
   } catch (error) {
      console.log(error);
      next(error);
   }
};
exports.unlikeSubs = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      await user.removeSubsLiked(parseInt(req.params.id, 10));
      res.send('success');
   } catch (error) {
      console.log(error);
      next(error);
   }
};
