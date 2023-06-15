const Sequelize = require('sequelize');

class Subs extends Sequelize.Model {
   static initiate(sequelize) {
      Subs.init(
         {
            name: {
               type: Sequelize.STRING(150),
               allowNull: true,
               unique: true,
            },
            title: {
               type: Sequelize.STRING(150),
               allowNull: true,
               unique: true,
            },
            description: {
               type: Sequelize.STRING(1500),
               defaultValue: 'test',
            },
            imageUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 'https://www.gravatar.com/avatar/0000?d=mp&f=y',
            },
            bannerUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 'https://www.gravatar.com/avatar/0000?d=mp&f=y',
            },
            totalPoint: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: true,
            modelName: 'Subs',
            tableName: 'subs',
         },
      );
   }
   static associate(db) {
      db.Subs.hasOne(db.Post);
      db.Subs.belongsToMany(db.User, {
         through: 'SubsLike',
         as: 'SubsLiker',
      });
   }
}
module.exports = Subs;
