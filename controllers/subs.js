const { sequelize } = require('../models');
const Subs = require('../models/subs');
const Post = require('../models/post');

exports.getSubs = async (req, res, next) => {
   try {
      // 해당 subs의 데이터와 subs의 게시물들
      const subs = await Subs.findOne({
         where: { name: req.params.name },
         raw: true,
      });
      const post = await Post.findAll({
         where: { id: subs.id },
      });
      const subsImage = subs.imageUrn;
      const bannerImage = subs.bannerUrn;
      const baseUrl = 'http://givou.site:7010/img/';

      subs.imageUrl = baseUrl + subsImage;
      subs.bannerUrl = baseUrl + bannerImage;
      delete subs.imageUrn;
      delete subs.bannerUrn;

      res.status(200).json({ subs, post });
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
