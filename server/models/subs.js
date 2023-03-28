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
               type: Sequelize.STRING(150),
               defaultValue: 'test',
            },
            imageUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 0,
            },
            bannerUrn: {
               type: Sequelize.STRING(150),
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
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
