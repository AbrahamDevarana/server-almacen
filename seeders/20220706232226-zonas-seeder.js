'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('zonas', [
		{
			nombre: '14 - Estacionamientos -3.20',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '15 - Estacionamientos -6.40',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '16 - Estacionamientos -9.60',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '18 - Estacionamientos -12.80',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-130 Instalación Vertical Hidraulica',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-131 Vertical Sanitaria',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-133 Vertical Pluvial',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '19-51 Escalera',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '19-52 Vestibulos ',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Style',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Style plus',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Elite',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Luxury',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},


  ], {});
   
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.bulkDelete('zonas', null, {});

  }
};



























