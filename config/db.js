const { Sequelize } = require('sequelize')
require('dotenv').config()

if(process.env.NODE_ENV === 'local'){

}

if(process.env.NODE_ENV === 'development'){

}

if(process.env.NODE_ENV === 'production'){
    
}

const db = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        pool:{
            max: 100,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        timezone: '-05:00',
        logging: false
    }
)

module.exports = db