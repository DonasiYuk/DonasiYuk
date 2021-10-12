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
      Transaction.belongsTo(models.Donation, { foreignKey: "donationId" })
      Transaction.belongsTo(models.User, { foreignKey: "donatorId" })
    }
  };
  Transaction.init({
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "amount is required" },
        notEmpty: { msg: "amount can't be empty" }
      }
    },
    donatorId: DataTypes.INTEGER,
    donationId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};