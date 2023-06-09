const express = require('express');

const { isLoggedIn } = require('../middlewares');
const {
   uploadComment,
   uploadCommentReply,
   getComment,
   updateComment,
   deleteComment,
} = require('../controllers/comment');

const router = express.Router();

router.get('/:id', getComment);

router.post('/:id', isLoggedIn, uploadComment);
router.post('/:id/reply/:commentId', isLoggedIn, uploadCommentReply);
router.patch('/:commentId', isLoggedIn, updateComment);
router.delete('/:commentId', isLoggedIn, deleteComment);

module.exports = router;

// class : 댓글 그룹 , order : 그룹 내 순서 , groupnumber : 댓글 그룹 내 댓글 개수

// a 댓글이 작성 됨
// class 1 order 1 groupnumber 1
// a 댓글의 대댓글
// class 1 order 2 groupnumber 2
// b 댓글이 작성 됨
// class 2 order 1 groupnumber 1
// a 댓글의 대댓글의 대댓글
// class 1 order 3 groupnumber 3
// a 댓글의 새로운 댓글
// class 1 order 2 groupnumber 4
