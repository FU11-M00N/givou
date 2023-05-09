const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const Subs = require('../models/subs');

const Sequelize = require('sequelize');

exports.afterUploadImage = (req, res) => {
   // image 미리보기
   try {
      console.log(req.file.filename);
      res.json({ url: `http://www.givou.site:7010/img/${req.file.filename}` });
   } catch (error) {
      console.error(error);
   }
};

exports.uploadPost = async (req, res, next) => {
   try {
      console.log(req.body.image);
      // select name from subs where name= req.body.sub  // post랑 subs랑 이어야 함
      const sub = await Subs.findOne({
         where: { name: req.body.sub },
      });

      const post = await Post.create({
         title: req.body.title,
         content: req.body.content,
         UserId: req.user.id,
         SubId: sub.id,
      });
      const hashtags = req.body.content.match(/#[^/s#]*/g);
      if (hashtags) {
         const result = await Promise.all(
            hashtags.map(tag => {
               return Hashtag.findOrCreate({
                  where: { title: tag.slice(1).toLowerCase() }, // # 제거 후 소문자로 변경
               });
            }),
         );
         await post.addHashtags(result.map(r => r[0]));
      }
      res.status(200).json(post.id);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
exports.updatePost = async (req, res, next) => {
   try {
      const post = await Post.findOne({
         where: { id: req.params.postId },
      });

      if (post.UserId === req.user.id) {
         Post.update(
            {
               title: req.body.title,
               content: req.body.content,
            },
            { where: { id: req.params.postId } },
         );
         res.status(200).json(post.id);
      } else {
         res.status(403).send('올바른 접근이 아닙니다.');
      }
   } catch (error) {
      console.log(error);
   }
};

exports.deletePost = async (req, res) => {
   try {
      const post = await Post.findOne({
         where: { id: req.params.postId },
      });

      if (req.user.id === post.UserId) {
         Post.destroy({
            where: { id: req.params.postId },
         });
         res.status(200).send('success');
      } else {
         res.status(403).send('올바른 접근이 아닙니다.');
      }
   } catch (error) {
      console.error(error);
   }
};

exports.likePost = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
         //insert into Like(Userid, Postid) values 1,1;
         await user.addLiked(parseInt(req.params.id, 10));
         res.send('success');
      }
   } catch (error) {
      console.log(error);
      next(error);
   }
};

exports.unlikePost = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
         //insert into Like(Userid, Postid) values 1,1;
         await user.removeLiked(parseInt(req.params.id, 10));
         res.send('success');
      }
   } catch (error) {
      console.log(error);
      next(error);
   }
};

exports.getPost = async (req, res, next) => {
   try {
      // 좋아요 갯수 데이터 반환

      // 유저정보 , sub 정보
      const base = Sequelize.fn('concat', Sequelize.col('posts.title'), 'test');
      const post = await Post.findOne({
         include: [
            {
               model: User,
               required: true,
               attributes: [
                  'id',
                  'email',
                  'nick',
                  'phoneNum',
                  [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('User.imageUrn')), 'imageUrl'],
                  [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('User.bannerUrn')), 'bannerUrl'],
                  'bio',
               ],
            },
            {
               model: Subs,
               required: true,
               attributes: [
                  'id',
                  'name',
                  'title',
                  'description',
                  [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('Sub.imageUrn')), 'imageUrl'],
                  [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('Sub.bannerUrn')), 'bannerUrl'],
               ],
            },
         ],
         attributes: [
            'id',
            'title',
            'content',
            // [Sequelize.fn('concat', 'http://givou.site:7010/img/', Sequelize.col('Post.imageUrn')), 'imageUrl'],
            'hit',
         ],
         where: { id: req.params.id },
      });

      let count = await Post.findOne({ where: { id: req.params.id }, attributes: ['hit'] });

      count.hit = count.hit + 1;
      await Post.update({ hit: count.hit }, { where: { id: req.params.id } });

      res.status(200).json(post);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

exports.getPosts = async (req, res, next) => {
   try {
      const page = req.query.page;
      //page = 0
      // select post from post order by created_at desc limit 3 offset 0;
      const posts = await Post.findAll({
         order: [['created_at', 'DESC']],
         offset: page,
         limit: 3,
      });

      res.status(200).json(posts);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
