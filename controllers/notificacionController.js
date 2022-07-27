const Notificaciones = require('../models/Notificaciones')
const { validationResult } = require('express-validator')
const { Op } = require('sequelize')


exports.getNotificaciones = async (req, res) => {

    const { id } = req.user;
    try {
        await Notificaciones.findAll({ where: { userId:id } })
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
        await Notificaciones.findAll({ where: { userId:id } })
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


