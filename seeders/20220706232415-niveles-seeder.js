'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('niveles', [
        {   nombre: "Estacionamientos -3.20",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Estacionamientos -6.40",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Estacionamientos -9.60",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Estacionamientos -12.80",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Amenidades",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Amenidades exteriores",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 1",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 2",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 3",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 4",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 5",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 6",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 7",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 8",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 9",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 10",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 11",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 12",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 13",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 14",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Edificación Nivel 15",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Azotea",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Sobre paso",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N1",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N2",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N3",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N4",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N5",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N6",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N7",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N8",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N9",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N10",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N11",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N12",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N13",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N14",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Vestibulos N15",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Portico",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Urbanización ",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {   nombre: "Jardines",
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        },

  ], {});
   
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.bulkDelete('niveles', null, {});

  }
};
