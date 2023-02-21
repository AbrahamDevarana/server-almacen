const Sequelize = require('sequelize')
const db = require('../config/db')

const Proyectos = db.define('proyectos', {

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
    clave: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    logo: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
        beforeUpdate: (proyecto) => {
            proyecto.updatedAt = new Date()
        }
    }
})

module.exports = Proyectos
