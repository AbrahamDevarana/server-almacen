const Sequelize = require('sequelize')
const db = require('../config/db')


const HistorialInsumo = db.define('historial_insumo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    }
}, 
{})