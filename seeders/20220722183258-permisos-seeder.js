'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permisos', [
        {
            nombre: 'Ver Usuarios',
            permiso: '/ver-usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Usuarios',
            permiso: '/crear-usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Usuarios',
            permiso: '/editar-usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Usuarios',
            permiso: '/eliminar-usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Roles',
            permiso: '/ver-roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Roles',
            permiso: '/crear-roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Roles',
            permiso: '/editar-roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Roles',
            permiso: '/eliminar-roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Insumos',
            permiso: '/ver-insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Insumos',
            permiso: '/crear-insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Insumos',
            permiso: '/editar-insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Insumos',
            permiso: '/eliminar-insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Personal',
            permiso: '/ver-personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Personal',
            permiso: '/crear-personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Personal',
            permiso: '/editar-personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Personal',
            permiso: '/eliminar-personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Zonas',
            permiso: '/ver-zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Zonas',
            permiso: '/crear-zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Zonas',
            permiso: '/editar-zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Zonas',
            permiso: '/eliminar-zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Actividades',
            permiso: '/ver-actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Actividades',
            permiso: '/crear-actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Actividades',
            permiso: '/editar-actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Actividades',
            permiso: '/eliminar-actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Obras',
            permiso: '/ver-obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Obras',
            permiso: '/crear-obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Obras',
            permiso: '/editar-obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Obras',
            permiso: '/eliminar-obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Niveles',
            permiso: '/ver-niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Niveles',
            permiso: '/crear-niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Niveles',
            permiso: '/editar-niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Niveles',
            permiso: '/eliminar-niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Vales',
            permiso: '/ver-vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Vales',
            permiso: '/crear-vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Acciones Vales',
            permiso: '/editar-vales',
            createdAt: new Date(),
            updatedAt: new Date()
        }
	], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('permisos', null, {});
     
  }
};
