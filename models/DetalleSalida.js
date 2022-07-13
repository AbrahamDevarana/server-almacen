const Sequelize = require('sequelize')
const db = require('../config/db')


const DetalleSalida = db.define('detalle_salida', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    valeSalidaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    insumoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
    },
    cantidadEntregada: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
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
        beforeUpdate: (detalle) => {
            detalle.updatedAt = new Date()
        }
    }
})

module.exports = DetalleSalida