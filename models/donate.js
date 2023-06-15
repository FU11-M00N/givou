const Sequelize = require('sequelize');

class Donate extends Sequelize.Model {
   static initiate(sequelize) {
      Donate.init(
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
            modelName: 'Donate',
            tableName: 'donates',
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {}
}

module.exports = Donate;
