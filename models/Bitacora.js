const Sequelize = require('sequelize')
const db = require('../config/db')

const Bitacora = db.define('bitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
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
    tipoBitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
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
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
   },
    hooks: {
        beforeUpdate: (bitacora) => {
            bitacora.updatedAt = new Date()
        }
    }
})

module.exports = Bitacora