const Notificaciones = require('../models/Notificaciones')
const { v4: uuid } = require('uuid');
const sockets = require('../services/socketIo');

exports.createNotification = async (almacenistasArray, titulo, mensaje, type) => {
    try {
        
        Notificaciones.bulkCreate(
            almacenistasArray.map( item => ({ 
                titulo,
                mensaje,
                status: 1,
                userId: item,
                type,
                uuid: uuid()
            })
        )).then( ( notificacion ) => {               
                sockets.to("almacen", "notificacion", [{ key: uuid(), label: mensaje }] )
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