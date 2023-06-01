const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const Comment = require('../models/comment');
const Sequelize = require('sequelize');

// 1. post, comment join
// 2. comment, user join
// 3. comment level

exports.getComment = async (req, res) => {
   try {
      // user 정보, 좋아요

      const comment = await Comment.findAll({
         include: {
            model: User,
            require: true,
         },
         where: { PostId: req.params.id },
         attributes: [
            'id',
            'content',
            'class',
            'order',
            [
               Sequelize.literal(
                  ` CASE substring(NOW(), '6', '6') WHEN substring(Comment.createdAt, '6','6') THEN substring(Comment.createdAt, '12', '5') else substring(Comment.createdAt, '1', '10') END`,
               ),
               'createdAt',
            ],
            [
               Sequelize.literal(
                  ` CASE substring(NOW(), '6', '6') WHEN substring(Comment.updatedAt, '6','6') THEN substring(Comment.updatedAt, '12', '5') else substring(Comment.updatedAt, '1', '10') END`,
               ),
               'updatedAt',
            ],
         ],
         order: [
            ['class', 'ASC'],
            ['order', 'ASC'],
         ],
      });
      comment[0].isdeleted = 'test';
      console.log(comment[0]);
      res.status(200).json(comment);
   } catch (error) {
      console.error(error);
   }
};

exports.uploadComment = async (req, res, next) => {
   try {
      await Comment.create({
         // class 값 넣을땐 현재 마지막 댓글의 클래스 번호가 몇번인지 체크 후 거기에 +1
         // cosnt a =select class from comment;
         // a = a+1
         content: req.body.content,
         class: (await Comment.max('class')) + 1,
         PostId: req.params.id,
         UserId: req.user.id,
      });
      res.send('success');
   } catch (error) {
      console.error(error);
      next(error);
   }
};

exports.updateComment = async (req, res) => {
   try {
      const comment = await Comment.findOne({
         where: {
            id: req.params.commentId,
         },
      });

      if (comment.UserId === req.user.id) {
         await Comment.update(
            {
               content: req.body.content,
            },
            {
               where: { id: req.params.commentId },
            },
         );
         res.status(200).send('success');
      } else {
         res.status(403).send('올바른 접근이 아닙니다.');
      }
   } catch (error) {
      console.error(error);
   }
};

exports.deleteComment = async (req, res) => {
   try {
      const comment = await Comment.findOne({
         where: { id: req.params.commentId },
      });
      if (comment === null) {
         res.status(404).json('올바른 접근이 아닙니다.');
      } else {
         if (req.user.id === comment.UserId) {
            Comment.destroy({
               where: { id: req.params.commentId },
            });
            res.status(200).send('successs');
         } else {
            res.status(403).send('올바른 접근이 아닙니다.');
         }
      }
   } catch (error) {
      console.error(error);
   }
};

// a 댓글

// class : 댓글 그룹 , order : 그룹 내 순서

// a 댓글 작성
// class 1 order 1
// a 댓글의 대댓글
// class 1 order 2
// b 댓글 작성
// class 2 order 1
// a 댓글의 대댓글의 대댓글
// class 1 order 3
// a 댓글의 새로운 댓글
// class 1 order 2

// select order from comments where Comment id = req.params.id
// update comments set order = order + 1 where

// order === 1{
//  order = order + 1,
//}
exports.uploadCommentReply = async (req, res, next) => {
   try {
      const comment = await Comment.findOne({
         // select order, class from comments where Comment id = req.params.id
         where: { id: req.params.commentId },
         attributes: ['class', 'order'],
      });

      // 대댓글이 이미 존재 할 때 | class 0 order 1
      // order랑 + 1
      // class 가 뭔지 확인하고, max +1

      // select max(order) from comment where class = comment.class
      const commentOrder = await Comment.findOne({
         group: 'class',
         attributes: [[Sequelize.fn('max', Sequelize.col('order')), 'order_max']],
         having: { class: comment.class },
      });
      let findMaxOrder = commentOrder.dataValues.order_max;
      findMaxOrder = findMaxOrder + 1;
      await Comment.create({
         content: req.body.content,
         class: comment.class,
         order: findMaxOrder,
         PostId: req.params.id,
         UserId: req.user.id,
      });

      res.send('success');
   } catch (error) {
      console.log(error);
      next(error);
   }
};
