const { sequelize } = require('../models');
const Subs = require('../models/subs');
const Post = require('../models/post');

exports.getSubs = async (req, res, next) => {
   try {
      // 해당 subs의 데이터와 subs의 게시물들
      const subs = await Subs.findOne({
         where: { name: req.params.name },
      });
      const post = await Post.findAll({
         where: { id: subs.id },
      });

      console.log('섭스', subs);
      console.log('포스트', post);
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
      });
      console.log(RandSubs);
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
