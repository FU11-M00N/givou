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
   }
}
module.exports = Subs;
