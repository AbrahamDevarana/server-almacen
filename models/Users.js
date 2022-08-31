const Sequelize = require('sequelize')
const db = require('../config/db')
const bcrypt = require('bcrypt')
const Role = require('./Role')


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
    puesto: {
        type: Sequelize.STRING,
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
    picture: {
        type: Sequelize.STRING,
        allowNull: true
    },
    suAdmin: {
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
            exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] 
        }
    }
})


Users.belongsTo(Role, { foreignKey: 'tipoUsuario_id' })

module.exports = Users;