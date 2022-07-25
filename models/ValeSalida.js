const Sequelize = require('sequelize')
const db = require('../config/db')

const ValeSalida = db.define('vale_salida', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    almacenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 4
    },
    obraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    nivelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    zonaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    actividadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    personalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    statusVale: { // 1: Sin Entregar 2: Parcialmente Entregado Abierto 3: Parcialmente Entregado Cerrado 4: Entregado 5: Cancelado 6: Borrador
        type: Sequelize.SMALLINT,
        allowNull: false,        
        defaultValue: 1
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    paranoid: true,
    hooks: {
        beforeUpdate: (vale) => {
            vale.updatedAt = new Date()
        }
    }
})

module.exports = ValeSalida

