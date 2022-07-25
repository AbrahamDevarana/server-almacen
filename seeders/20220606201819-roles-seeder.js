'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('roles', [
		{
            // id: 1,
			nombre: 'Administrador',
			descripcion: 'Administrador del sistema',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
            // id: 2,
			nombre: 'Compras',
			descripcion: 'Usuario de compras',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            // id: 3,
			nombre: 'Almacén',
			descripcion: 'Usuario de almacén',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            // id: 4,
			nombre: 'Test',
			descripcion: 'Rol de prueba, no eliminar',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},


	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('roles', null, {});
    
  }
};
