const Sequelize = require('sequelize')
const db = require('../config/db')

const Personal = db.define('personal', {
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
    apellidoPaterno: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidoMaterno: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    especialidad:{
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
},  {
    paranoid: true,
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    },
    hooks: {
        beforeCreate(personal) {
            personal.createdAt = new Date()
            personal.updatedAt = new Date()
        },
        beforeUpdate(personal) {
            personal.updatedAt = new Date()
        }
    }   
})


module.exports = Personal
