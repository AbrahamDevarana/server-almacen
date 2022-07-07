'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.bulkInsert('unidades', [
		{
			nombre: 'Tonelada',
			nombreCorto: 'TON',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Kilogramo',
			nombreCorto: 'KG',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Mililitro',
			nombreCorto: 'ML',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Tramo',
			nombreCorto: 'TRAMO',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Bulto',
			nombreCorto: 'BULTO',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Pieza',
			nombreCorto: 'PZA',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Litro',
			nombreCorto: 'LT',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Bolsa',
			nombreCorto: 'BOLSA',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Litro',
			nombreCorto: 'LITRO',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Bote',
			nombreCorto: 'BOTE',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Galon',
			nombreCorto: 'GALON',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Cubet',
			nombreCorto: 'CUBET',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Metros',
			nombreCorto: 'MTS',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Metros con M',
			nombreCorto: 'M',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Rollo',
			nombreCorto: 'ROLLO',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Metros cuadrados',
			nombreCorto: 'M2',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Caja',
			nombreCorto: 'CAJA',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},

	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('unidades', null, {});
    
  }
};
