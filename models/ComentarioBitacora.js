const Sequelize = require('sequelize')
const db = require('../config/db')

const ComentariosBitacora = db.define('comentariosBitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    bitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comentario: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    autorId: {
        type: Sequelize.INTEGER,
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
}, {
    paranoid: true,
    timestamps: true
})

module.exports = ComentariosBitacora
