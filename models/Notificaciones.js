const Sequelize = require('sequelize')
const db = require('../config/db')


const Notificaciones = db.define('notificaciones', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mensaje: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: Sequelize.INTEGER,
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
        beforeUpdate: (notificaciones) => {
            notificaciones.updatedAt = new Date()
        }
    }
})

module.exports = Notificaciones
