const Sequelize = require('sequelize')
const db = require('../config/db')


const Obra = db.define('obra', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    clave: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    centroCosto: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    obra: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.BOOLEAN,
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
    hooks: {
        beforeUpdate: (obra) => {
            obra.updatedAt = new Date()
            obra.obra = obra.clave.split('-')[0]
            obra.centroCosto = obra.clave.split('-')[1]
        },
        beforeCreate: (obra) => {
            obra.obra = obra.clave.split('-')[0]
            obra.centroCosto = obra.clave.split('-')[1]
        }
    
    }}
)



module.exports = Obra