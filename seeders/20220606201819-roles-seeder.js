'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('roles', [
		{
            id: 1,
			nombre: 'Administrador',
			descripcion: 'Administrador del sistema',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()

		},
		{
            id: 2,
			nombre: 'Comprador',
			descripcion: 'Usuario de compras',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            id: 3,
			nombre: 'Almacenista',
			descripcion: 'Usuario de almacén',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            id: 4,
			nombre: 'Residente de Obra',
			descripcion: 'Usuario de residente',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            id: 5,
			nombre: 'Pruebas',
			descripcion: 'Rol de prueba, no eliminar',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            id: 6,
			nombre: 'Control Presupuestal',
			descripcion: 'Perfil de control presupuestal',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
            id: 7,
			nombre: 'Coordinador de Obra',
			descripcion: 'Coordinador de obra',
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
