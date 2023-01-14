const Sequelize = require('sequelize')
const db = require('../config/db');

const PivotBitacoraUser = db.define('pivot_bitacora_users', {
    bitacoraId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    visited: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
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
    hooks: {
        beforeUpdate: (pivot) => {
            pivot.updatedAt = new Date()
        }
    }   

});

module.exports = PivotBitacoraUser;