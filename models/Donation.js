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
      Donation.belongsTo(models.User, { foreignKey: "userId" })
      Donation.hasMany(models.Report, { foreignKey: "donationId" })
      Donation.hasMany(models.Transaction, { foreignKey: "donationId" })
    }
  };
  Donation.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'title is required' },
        notEmpty: { msg: 'title cant be empty' }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'description is required' },
        notEmpty: { msg: 'description cant be empty' }
      }
    },
    targetAmount: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'Amount is required' },
        notEmpty: { msg: "Amount cant be empty" }
      }
    },
    userId: DataTypes.INTEGER,
    lat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'address is required' },
        notEmpty: { msg: 'address cant be empty' }
      }
    },
    long: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'address is required' },
        notEmpty: { msg: 'address cant be empty' }
      }
    },
    balance: DataTypes.INTEGER,
    image: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(instance) {
        instance.balance = 0
        instance.status = "incomplete"
      }
    },
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};