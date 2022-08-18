'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permisos', [
        {
            nombre: 'Ver Usuarios',
            permiso: '/ver-usuarios',
            permisos: 'ver usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Usuarios',
            permiso: '/crear-usuarios',
            permisos: 'crear usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Usuarios',
            permiso: '/editar-usuarios',
            permisos: 'editar usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Usuarios',
            permiso: '/eliminar-usuarios',
            permisos: 'eliminar usuarios',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Roles',
            permiso: '/ver-roles',
            permisos: 'ver roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Roles',
            permiso: '/crear-roles',
            permisos: 'crear roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Roles',
            permiso: '/editar-roles',
            permisos: 'editar roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Roles',
            permiso: '/eliminar-roles',
            permisos: 'eliminar roles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Insumos',
            permiso: '/ver-insumos',
            permisos: 'ver insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Insumos',
            permiso: '/crear-insumos',
            permisos: 'crear insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Insumos',
            permiso: '/editar-insumos',
            permisos: 'editar insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Insumos',
            permiso: '/eliminar-insumos',
            permisos: 'eliminar insumos',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Personal',
            permiso: '/ver-personal',
            permisos: 'ver personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Personal',
            permiso: '/crear-personal',
            permisos: 'crear personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Personal',
            permiso: '/editar-personal',
            permisos: 'editar personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Personal',
            permiso: '/eliminar-personal',
            permisos: 'eliminar personal',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Zonas',
            permiso: '/ver-zonas',
            permisos: 'ver zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Zonas',
            permiso: '/crear-zonas',
            permisos: 'crear zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Zonas',
            permiso: '/editar-zonas',
            permisos: 'editar zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Zonas',
            permiso: '/eliminar-zonas',
            permisos: 'eliminar zonas',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Actividades',
            permiso: '/ver-actividades',
            permisos: 'ver actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Actividades',
            permiso: '/crear-actividades',
            permisos: 'crear actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Actividades',
            permiso: '/editar-actividades',
            permisos: 'editar actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Actividades',
            permiso: '/eliminar-actividades',
            permisos: 'eliminar actividades',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Obras',
            permiso: '/ver-obras',
            permisos: 'ver obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Obras',
            permiso: '/crear-obras',
            permisos: 'crear obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Obras',
            permiso: '/editar-obras',
            permisos: 'editar obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Obras',
            permiso: '/eliminar-obras',
            permisos: 'eliminar obras',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Niveles',
            permiso: '/ver-niveles',
            permisos: 'ver niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Niveles',
            permiso: '/crear-niveles',
            permisos: 'crear niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Editar Niveles',
            permiso: '/editar-niveles',
            permisos: 'editar niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Eliminar Niveles',
            permiso: '/eliminar-niveles',
            permisos: 'eliminar niveles',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Vale',
            permiso: '/ver-vale',
            permisos: 'ver vale',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Crear Vales',
            permiso: '/crear-vales',
            permisos: 'crear vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Entregar Vales',
            permiso: '/entregar-vales',
            permisos: 'entregar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Cancelar Vales',
            permiso: '/eliminar-vales',
            permisos: 'eliminar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Registrar Vales',
            permiso: '/registrar-vales',
            permisos: 'registrar vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Ver Todos los Vales',
            permiso: '/ver-vales',
            permisos: 'ver vales',
            createdAt: new Date(),
            updatedAt: new Date()
        },
	], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('permisos', null, {});
     
  }
};
