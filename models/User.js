'use strict';
const {
  Model
} = require('sequelize');
const { encode } = require('../helpers/bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Donation, {foreignKey: "userId"})
      User.hasMany(models.Transaction, {foreignKey: "donatorId"})
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Username is required' },
        notEmpty: { msg: 'Username cant be empty'}
      }
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Wrong format email' },
        notNull: { msg: 'Email is required' },
        notEmpty: { msg: 'Email cant be empty'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        notEmpty: { msg: 'Password cant be empty'},
        len: {
          args: [5,255],
          msg: 'Password min length is 5'
        }
      }
    },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(instance) {
        instance.password = encode(instance.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};