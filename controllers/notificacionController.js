const Notificaciones = require('../models/Notificaciones')
const { validationResult } = require('express-validator')
const { v4: uuid } = require('uuid');

exports.getNotificaciones = async (req, res) => {

    const { id, tipoUsuario_id } = req.user;

    const where = {}
    where.status = 1

    if (tipoUsuario_id === 3) {
        where.type = 1
    } else {
        where.userId = id
    }

    try {
        await Notificaciones.findAll({ where })
        .then( notificaciones => {
            if(notificaciones){
                res.status(200).json({ notificaciones })
            }else{
                res.status(404).json({ message: 'No hay notificaciones' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener las notificaciones', error: error.message })
        })

    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateNotificacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.mapped() });
    }

    const { id } = req.user;

    try {
        await Notificaciones.findAll({ where: { userId:id, status: 1 } })
        .then( notificaciones => {

            notificaciones.forEach(notificacion => {
                notificacion.update({
                    status: 0
                })
            })

            res.status(200).json({ message: 'Notificaciones actualizadas', notificaciones })
            
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al actualizar la notificacion', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }   
}

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