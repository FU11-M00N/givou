const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const Subs = require('../models/subs');
exports.afterUploadImage = (req, res) => {
   // image 미리보기
   try {
      res.json({ url: `/img/${req.file.filename}` });
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
         imageUrn: req.body.image,
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
      res.send('success');
   } catch (error) {
      console.error(error);
      next(error);
   }
};
exports.updatePost = async (req, res, next) => {
   try {
      Post.update(
         {
            title: req.body.title,
            content: req.body.content,
            img: req.body.url,
         },
         { where: { UserId: req.user.id } },
      );
      res.status(200).send('success');
   } catch (error) {
      console.log(error);
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
      let count = await Post.findOne({ where: { id: req.params.id }, attributes: ['hit'] });
      // select hit from post where id = 1
      count.hit = count.hit + 1;
      await Post.update({ hit: count.hit }, { where: { id: req.params.id } });
      res.send('success');
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
      }); // select * from post;

      res.status(200).json(posts);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
