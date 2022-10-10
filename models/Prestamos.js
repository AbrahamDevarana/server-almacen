const Sequelize = require('sequelize')
const db = require('../config/db')

const Prestamos = db.define('prestamos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    belongsTo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    deliverTo: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    status:{
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: '1: Nuevo, 2: Autorizado, 3: Rechazado, 4: Devuelto, 5: Verificado 6: Ticket Cancelado'
    },
    valeSalidaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        afterUpdate(prestamos) {
            prestamos.updatedAt = new Date()
        }
    }
})

module.exports = Prestamos
