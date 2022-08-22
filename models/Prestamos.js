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
    detalleSalidaId: {
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
    }
},  {
    paranoid: true,
    hooks: {
        afterUpdate(prestamos) {
            prestamos.updatedAt = new Date()
        }
    }
})

module.exports = Prestamos
