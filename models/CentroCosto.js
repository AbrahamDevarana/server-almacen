const Sequelize = require('sequelize')
const db = require('../config/db')


const CentroCosto = db.define('centro_costos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nombreCorto: {
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
    }
}, {
    paranoid: true,
    hooks: {
        beforeUpdate: (centroCosto) => {
            centroCosto.updatedAt = new Date()
        }
    }
})

module.exports = CentroCosto