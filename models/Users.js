const Sequelize = require('sequelize')
const db = require('../config/db')
const bcrypt = require('bcrypt')


const Users = db.define('users', {
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
    apellidoPaterno: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidoMaterno: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefono: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tipoUsuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    puesto_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    google_id:{
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
        beforeUpdate: (usuario) => {
            usuario.updatedAt = new Date()
        },
        beforeCreate: (usuario) => {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    },
    defaultScope: {
        attributes:{
            exclude: ['password']
        }
    }
})

module.exports = Users;