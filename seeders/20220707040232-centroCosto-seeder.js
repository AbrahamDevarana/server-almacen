'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('centro_costos', [
		{
			nombre: 'Centro de Costo 1',
			nombreCorto: 'CC1',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Centro de Costo 2',
			nombreCorto: 'CC2',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: 'Centro de Costo 3',
			nombreCorto: 'CC3',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		}

	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('centro_costos', null, {});
    
  }
};
