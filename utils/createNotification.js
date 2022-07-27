const Notificaciones = require('../models/Notificaciones')
const { v4: uuid } = require('uuid');

exports.createNotification = async (almacenistasArray, titulo, mensaje) => {
    try {
        
        Notificaciones.bulkCreate(
            almacenistasArray.map( item => ({ 
                titulo,
                mensaje,
                status: 1,
                userId: item,
                uuid: uuid()
            })
        )).then( () => {
            return true
        }
        ).catch(error => {
            console.log(error)
            return false
        })
    } catch (error) {
        console.log(error.message);
        return error.message
    }
}