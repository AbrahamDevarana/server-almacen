const { Sequelize } = require('sequelize')
require('dotenv').config()

const db = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        pool:{
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

module.exports = db