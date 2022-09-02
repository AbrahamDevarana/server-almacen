'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permisos', [
        {
            nombre: 'Ver Usuarios',
            permisos: 'ver usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Usuarios',
            permisos: 'crear usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Usuarios',
            permisos: 'editar usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Usuarios',
            permisos: 'eliminar usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Roles',
            permisos: 'ver roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Roles',
            permisos: 'crear roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Roles',
            permisos: 'editar roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Roles',
            permisos: 'eliminar roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Insumos',
            permisos: 'ver insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Insumos',
            permisos: 'crear insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Insumos',
            permisos: 'editar insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Insumos',
            permisos: 'eliminar insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Personal',
            permisos: 'ver personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Personal',
            permisos: 'crear personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Personal',
            permisos: 'editar personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Personal',
            permisos: 'eliminar personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Zonas',
            permisos: 'ver zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Zonas',
            permisos: 'crear zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Zonas',
            permisos: 'editar zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Zonas',
            permisos: 'eliminar zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Actividades',
            permisos: 'ver actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Actividades',
            permisos: 'crear actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Actividades',
            permisos: 'editar actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Actividades',
            permisos: 'eliminar actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Obras',
            permisos: 'ver obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Obras',
            permisos: 'crear obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Obras',
            permisos: 'editar obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Obras',
            permisos: 'eliminar obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Niveles',
            permisos: 'ver niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Niveles',
            permisos: 'crear niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Niveles',
            permisos: 'editar niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Niveles',
            permisos: 'eliminar niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Vale',
            permisos: 'ver vale',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Vales',
            permisos: 'crear vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Entregar Vales',
            permisos: 'entregar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Cancelar Vales',
            permisos: 'eliminar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Registrar Vales',
            permisos: 'registrar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Todos los Vales',
            permisos: 'ver vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Préstamos',
            permisos: 'ver prestamos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Acciones Prestamos',
            permisos: 'acciones prestamos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
	], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('permisos', null, {});
     
  }
};
