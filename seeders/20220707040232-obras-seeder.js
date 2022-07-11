'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('obras', [

// Amenidades Torre A
// Amenidades Torre B
// Obra Cabecera Torre A
// Obra Cabecera Torre B
// Edificación Torre A
// Edificación Torre B
// Urbanzación
// Postventa
// Oficinas Showroom.
		{
			nombre: 'Amenidades Torre A',
			clave: 'AM1 - RV3',
			status: true,
		},
		{
			nombre: 'Amenidades Torre B',
			clave: 'AM2 - RV3',
			status: true,
		},
		{
			nombre: 'Obra Cabecera Torre A',
			clave: 'OCA - RV2',
			status: true,
		},
		{
			nombre: 'Obra Cabecera Torre B',
			clave: 'OCB - RV2',
			status: true,
		},
		{	
			nombre: 'Edificación Torre A',
			clave: 'ETA - RV2',
			status: true,
		},
		{
			nombre: 'Edificación Torre B',
			clave: 'ETB - RV2',
			status: true,
		},
		{
			nombre: 'Urbanzación',
			clave: 'URV - RV1',
			status: true,
		},
		{
			nombre: 'Postventa',
			clave: 'PTV - RV9',
			status: true,
		},
		{
			nombre: 'Oficinas Showroom',
			clave: 'RV3 - RV3',
			status: true,
		},


	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('obras', null, {});
    
  }
};
