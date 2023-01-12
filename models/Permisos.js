const Sequelize = require('sequelize')
const db = require('../config/db')

const Permisos = db.define('permisos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    permisos: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    },
})

module.exports = Permisos