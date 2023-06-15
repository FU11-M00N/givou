const Sequelize = require('sequelize');

class Payment extends Sequelize.Model {
   static initiate(sequelize) {
      Payment.init(
         {
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
            modelName: 'Payment',
            tableName: 'payments',
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {
      // 유저가 포인트를 충전함 - 결제 기록

      // 유저의 포인트를 subs에 기부함 - 기부 기록

      db.Payment.belongsTo(db.User);
   }
}

module.exports = Payment;
