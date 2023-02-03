const Sequelize = require('sequelize')
const db = require('../config/db')

const MailBitacora = db.define('ext_mail_bitacora', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
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

module.exports = MailBitacora


