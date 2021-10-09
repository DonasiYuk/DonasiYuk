'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Donation.belongsTo(models.User, {foreignKey: "userId"})
      Donation.hasMany(models.Report, {foreignKey: "donationId"})
      Donation.hasMany(models.Transaction, {foreignKey: "donationId"})
    }
  };
  Donation.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    targetAmount: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    lat: DataTypes.INTEGER,
    long: DataTypes.INTEGER,
    balance: DataTypes.INTEGER,
    image: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};