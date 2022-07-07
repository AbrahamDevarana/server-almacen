'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('actividades', [
		{
			nombre: 'Albañilerias estacionamientos',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '32 - Acabados estacionamientos',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '33 - Accesorios de iluminacion estacionamientos',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '34 - Herrería estacionamientos',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-130 Instalación Vertical Hidraulica',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-131 Vertical Sanitaria',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '13-133 Vertical Pluvial',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '19-51 Escalera',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '19-52 Vestibulos ',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '101 albañilerias',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '103 Inst. Hidraulica',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '104 Inst. Sanitaria',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '105 Inst. Electrica',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '106 Inst. Voz y datos',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '107 Accesorios de iluminación',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '108 Muebles sanitarios y griferia',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '110 Mármol y granito',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '111 Pisos y azulejo',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '112 Pintura',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '113 Carpinteria',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '115 Equipamiento de cocina',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '116 Inst. Gas',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			nombre: '117 Inst. Extracción',
			descripcion: '',
			status: 1,
			createdAt: new Date(),
			updatedAt: new Date()
		},

  ], {});
   
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.bulkDelete('actividades', null, {});

  }
};
























