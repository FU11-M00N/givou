const Sequelize = require('sequelize');

class User extends Sequelize.Model {
   static initiate(sequelize) {
      User.init(
         {
            email: {
               type: Sequelize.STRING(40),
               allowNull: true,
               unique: true,
            },
            nick: {
               type: Sequelize.STRING(15),
               allowNull: false,
            },
            phoneNum: {
               type: Sequelize.STRING(20),
               allowNull: true,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: true,
            },
            imageUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 'https://www.gravatar.com/avatar/0000?d=mp&f=y',
            },
            bannerUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 'https://www.gravatar.com/avatar/0000?d=mp&f=y',
            },
            bio: {
               type: Sequelize.STRING(500),
               defaultValue: '',
            },
            provider: {
               type: Sequelize.ENUM('local', 'kakao', 'google'),
               allowNull: false,
               defaultValue: 'local',
            },
            snsId: {
               type: Sequelize.STRING(30),
               allowNull: true,
            },
            point: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            onDelete: 'CASCADE',
         },
      );
   }
   static associate(db) {
      db.User.hasMany(db.Post);
      db.User.belongsToMany(db.Post, {
         through: 'PostLike',
         as: 'Liked',
      });

      db.User.belongsToMany(db.Subs, {
         through: 'SubsLike',
      });

      db.User.hasMany(db.Comment); // 1:N 유저, 댓글
      db.User.belongsToMany(db.Comment, {
         through: 'CommentLike',
         as: 'CommentLiked',
      });

      db.User.hasMany(db.Payment);
      db.User.hasMany(db.Donate);
   }
}
module.exports = User;
