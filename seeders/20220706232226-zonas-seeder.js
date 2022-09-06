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
            nombre: 'Estacionamientos -3.20',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Estacionamientos -6.40',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Estacionamientos -9.60',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Estacionamientos -12.80',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Inst. Vertical Hidrálica',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Inst. Vertical Sanitaria',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Inst. Vertical pluvial',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Inst. Vertical gas',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Escaleras',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Azotea',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Elevadores',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Vestilbulos',
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
        {
            nombre: 'Showroom',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Portico',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Urbanización',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Parque/Jardines',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Fachada ',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Amenidades',
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            nombre: 'Amenidades exteriores',
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



























