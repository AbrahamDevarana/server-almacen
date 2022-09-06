'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
	await queryInterface.bulkInsert('obras', [
{
            nombre: 'Amenidades Torre A',
            clave: 'AM1 - RV3',
            status: true
        },
        {
            nombre: 'Amenidades Torre B',
            clave: 'AM2 - RV3',
            status: true
        },
        {
            nombre: 'Amenidades Torre C',
            clave: 'AM3 - RV3',
            status: true
        },
        {
            nombre: 'Ampliación oficinas',
            clave: 'OSW - RV3',
            status: true
        },
        {
            nombre: 'Urbanización',
            clave: 'URV - RV1',
            status: true
        },
        {
            nombre: 'Edificación TA',
            clave: 'ETA - RV2',
            status: true
        },
        {
            nombre: 'Edificación TB',
            clave: 'ETB - RV2',
            status: true
        },
        {
            nombre: 'Edificación TC',
            clave: 'ETC - RV2',
            status: true
        },
        {
            nombre: 'Obra cabecera TA',
            clave: 'OCA - RV2',
            status: true
        },
        {
            nombre: 'Obra cabecera TB',
            clave: 'OCB - RV2',
            status: true
        },
        {
            nombre: 'Obra cabecera TC',
            clave: 'OCC - RV2',
            status: true
        },
        {
            nombre: 'Post venta TA',
            clave: 'PVA - RV9',
            status: true
        },


	], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('obras', null, {});
    
  }
};
