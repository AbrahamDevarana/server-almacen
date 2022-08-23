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
    cantidadSolicitada: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
    },
    cantidadEntregada: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    status:{ /// 1: Sin Entregar 2: Parcialmente Entregado Abierto 3: Parcialmente Entregado Cerrado 4: Entregado 4: Sin Insumos
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    comentarios:{
        type: Sequelize.TEXT,
        allowNull: true,
    },
    prestamoId:{
        type: Sequelize.INTEGER,
        allowNull: true
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