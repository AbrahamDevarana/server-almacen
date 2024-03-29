'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('users', [
		{
            nombre: 'Abraham',
            apellidoPaterno: 'Alvarado',
            apellidoMaterno: 'Guevara',
            email: 'abrahamalvarado@devarana.mx',
            password: '6e7c55338688e7843f9256dc90ea5e71',
            telefono: '1234567890',
            tipoUsuario_id: '1',
            puesto: 'Desarrollador Web',
            status: 1,
            suAdmin: 1,
            createdAt: new Date(),
            updatedAt: new Date()
		},
        {
			nombre: 'Fátima',
            apellidoPaterno: 'Benitez',
            apellidoMaterno: 'Ortiz',
            email: 'fatimaortiz@devarana.mx',
            password: '6e7c55338688e7843f9256dc90ea5e71',
            telefono: '1234567890',
            tipoUsuario_id: '2',
            puesto: 'Gerente de Innovación y Calidad',
            status: 1,
            suAdmin: 1,
            createdAt: new Date(),
            updatedAt: new Date()
		},
		

	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});
    
  }
};
