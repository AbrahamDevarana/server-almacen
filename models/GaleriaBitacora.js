const Sequelize = require('sequelize')
const db = require('../config/db')

const GaleriaBitacora = db.define('galeria_bitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    uid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    url: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
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
}, {
    paranoid: true,
    defaultScope:{
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
   },
    hooks: {
        beforeUpdate: (galeria) => {
            galeria.updatedAt = new Date()
        }
    }
})

module.exports = GaleriaBitacora
