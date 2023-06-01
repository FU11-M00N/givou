const posts = await Post.findAll({
   include: [
      {
         model: Subs,
         required: true,
         attributes: [],
         where: {
            name: 'test222', // req.params.name
         },
      },
      {
         model: User,
         required: true,
         attributes: [[Sequelize.fn('COUNT', Sequelize.col('Posts.id')), 'likeCount']],
      },
   ],
   attributes: [
      'id',
      'title',
      'hit',
      'UserId',
      'User.nick',
      [
         Sequelize.literal(
            `CASE SUBSTRING(NOW(), 6, 6) WHEN SUBSTRING(Post.createdAt, 6, 6) THEN SUBSTRING(Post.createdAt, 12, 5) ELSE SUBSTRING(Post.createdAt, 1, 10) END`,
         ),
         'createdAt',
      ],
   ],
   group: ['Post.id'],
   raw: true,
});
