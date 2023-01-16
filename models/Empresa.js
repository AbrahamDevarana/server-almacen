const Sequelize = require('sequelize')
const db = require('../config/db')

const Empresa = db.define('empresa', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre: {
        type: Sequelize.STRING,
    },
    rfc: {
        type: Sequelize.STRING,
        unique: true
    },
    direccion: {
        type: Sequelize.STRING,
    },
    telefono: {
        type: Sequelize.STRING,
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
        beforeUpdate: (empresa) => {
            empresa.updatedAt = new Date()
        }
    }
})

module.exports = Empresa


