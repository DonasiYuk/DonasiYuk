'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [
      {
        title: "Bantu Arsyad beli Lamborghini",
        description: "ayo bantu Arsyad mewujudkan membeli mobil impiannya dengan membiayai mobil beserta pajaknya",
        targetAmount: "5.000.000.000",
        userId: 2,
        lat: 0,
        long: 0,
        balance: 0,
        image: "https://images.unsplash.com/photo-1599135343721-6c8d4c1b8b58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1385&q=80",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Bantu Avianto memenuhi keperluan jambannya",
        description: "ayo kita bantu avianto untuk mewujudkan kebutuhan jamban yang diinginkannya",
        targetAmount: "100.000.000",
        userId: 1,
        lat: 0,
        long: 0,
        balance: 0,
        image: "https://akwnulis.files.wordpress.com/2017/04/1491132162-picsay.jpg",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Bantu Alvin membeli PC Gaming impiannya",
        description: "Alvin ingin mewujudkan PC Gaming impiannya, mari kita bantu!!",
        targetAmount: "150.000.000",
        userId: 2,
        lat: 0,
        long: 0,
        balance: 0,
        image: "https://w0.peakpx.com/wallpaper/144/852/HD-wallpaper-pc-gamer-1-game-pc-gamer.jpg",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Bantu Kautsar membeli sepatu Air Jordan",
        description: "mari kita wujudkan keinginan Kautsar!!!",
        targetAmount: "10.000.000",
        userId: 1,
        lat: 0,
        long: 0,
        balance: 0,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bmlrZSUyMGpvcmRhbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Kesakitan!! Bantu Andi menyembuhkan luka dikakinya karena dipatil lele",
        description: "mari kita bantu Andi untuk menyembuhkan kakinya",
        targetAmount: "10.000",
        userId: 2,
        lat: 0,
        long: 0,
        balance: 0,
        image: "",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Mari kita bantu Junaedi menyembuhkan sakit hatinya karena diselingkuhi",
        description: "Junaedi mempergoki pacarnya sedang selingkuh di pinggir rel kereta",
        targetAmount: "2.000.000",
        userId: 1,
        lat: 0,
        long: 0,
        balance: 0,
        image: "",
        status: "incomplete",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]

    await queryInterface.bulkInsert('Donations', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Donations', null, {});
  }
};
