const Sequelize = require('sequelize');

class Donate extends Sequelize.Model {
   static initiate(sequelize) {
      Donate.init(
         {
            // 어떤 유저가 어떤 섭스에 얼마를 기부 했는가,
            point: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: true,
            modelName: 'Donate',
            tableName: 'donate',
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {
      // 유저 1:N
      db.Donate.belongsTo(db.User);
      // subs 1:N
      db.Donate.belongsTo(db.Subs);
   }
}

module.exports = Donate;
