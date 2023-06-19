const Sequelize = require('sequelize');

class Payment extends Sequelize.Model {
   static initiate(sequelize) {
      Payment.init(
         {
            payMethod: {
               type: Sequelize.STRING(50),
            },
            merchantUid: {
               type: Sequelize.STRING(50),
            },
            name: {
               type: Sequelize.STRING(100),
            },
            amount: {
               type: Sequelize.INTEGER,
            },
            buyerEmail: {
               type: Sequelize.STRING(100),
            },
            buyerName: {
               type: Sequelize.STRING(100),
            },
            buyerTel: {
               type: Sequelize.STRING(100),
            },
            paymentVrfct: {
               type: Sequelize.BOOLEAN,
               defaultValue: false,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: true,
            modelName: 'Payment',
            tableName: 'payment',
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {
      db.Payment.belongsTo(db.User);
   }
}

module.exports = Payment;
