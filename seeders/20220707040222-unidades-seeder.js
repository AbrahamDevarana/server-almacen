'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
	await queryInterface.bulkInsert('unidades', [
		{
			nombre: 'Tonelada',
			nombreCorto: 'TON',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Kilogramo',
			nombreCorto: 'KG',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Mililitro',
			nombreCorto: 'ML',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Tramo',
			nombreCorto: 'TRAMO',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Bulto',
			nombreCorto: 'BULTO',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Pieza',
			nombreCorto: 'PZA',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Litro',
			nombreCorto: 'LT',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Bolsa',
			nombreCorto: 'BOLSA',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Litro',
			nombreCorto: 'LITRO',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Bote',
			nombreCorto: 'BOTE',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Galon',
			nombreCorto: 'GALON',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Cubet',
			nombreCorto: 'CUBET',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Metros',
			nombreCorto: 'MTS',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Metros con M',
			nombreCorto: 'M',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Rollo',
			nombreCorto: 'ROLLO',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Metros cuadrados',
			nombreCorto: 'M2',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Caja',
			nombreCorto: 'CAJA',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},

	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('unidades', null, {});
    
  }
};
