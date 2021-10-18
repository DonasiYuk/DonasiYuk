'use strict';

const {encode} = require('../helpers/bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = [
      {
        username: 'admin',
        email: 'admin@mail.com',
        password: encode('12345'),
        role: 'admin',
        phoneNumber: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jamban',
        email: 'jamban@mail.com',
        password: encode('12345'),
        role: 'user',
        phoneNumber: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await queryInterface.bulkInsert('Users', user, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
