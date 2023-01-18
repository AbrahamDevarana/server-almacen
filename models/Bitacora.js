const Sequelize = require('sequelize')
const db = require('../config/db')

const Bitacora = db.define('bitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    uid:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4        
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    etapaId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    obraId: {
        type: Sequelize.INTEGER,
    },
    nivelId: {
        type: Sequelize.INTEGER,
    },
    zonaId: {
        type: Sequelize.INTEGER,
    },
    actividad: {
        type: Sequelize.TEXT,
    },
    externoId: {
        type: Sequelize.INTEGER,
    },
    autorId: {
        type: Sequelize.INTEGER,
    },
    esInterno:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    tipoBitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    status: {
        type: Sequelize.INTEGER,
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
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
   },
    hooks: {
        beforeUpdate: (bitacora) => {
            bitacora.updatedAt = new Date()
        }
    }
})

module.exports = Bitacora