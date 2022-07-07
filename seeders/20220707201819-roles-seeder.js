'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('centro_costos', [
		{
			nombre: 'Administrador',
			descripcion: 'Administrador del sistema',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
			nombre: 'Compras',
			descripcion: 'Usuario de compras',
			status: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},


	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('centro_costos', null, {});
    
  }
};
