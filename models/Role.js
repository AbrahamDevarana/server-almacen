const Sequelize = require('sequelize')
const db = require('../config/db')

const Role = db.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false
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
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    },
    hooks: {
        beforeUpdate: (role) => {
            role.updatedAt = new Date()
        },
    },
})

module.exports = Role