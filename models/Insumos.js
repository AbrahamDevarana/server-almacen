const Sequelize = require('sequelize')
const db = require('../config/db')


const Insumo = db.define('insumos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    claveEnk: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    centroCosto: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    unidadMedida: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
}, {
    paranoid: true,
    hooks: {
        beforeUpdate: (insumo) => {
            insumo.updatedAt = new Date()
        }
    }}
)

module.exports = Insumo