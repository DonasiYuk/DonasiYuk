'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Donation, {foreignKey: "donationId"})
      Transaction.belongsTo(models.User, {foreignKey: "donatorId"})
    }
  };
  Transaction.init({
    amount: DataTypes.INTEGER,
    donatorId: DataTypes.INTEGER,
    donationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};