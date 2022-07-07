'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('niveles', [
		{
			nombre: 'Nivel 1',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 2',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 3',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 4',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 5',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 6',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 7',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 8',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 9',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 10',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 11',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 12',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 13',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 14',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Nivel 15',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		}
  ], {});
   
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.bulkDelete('niveles', null, {});

  }
};
