const Sequelize = require('sequelize')
const db = require('../config/db')

const GaleriaComentario = db.define('galeria_comentario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    comentarioId: {
        type: Sequelize.INTEGER,
        allowNull: false
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


module.exports = GaleriaComentario