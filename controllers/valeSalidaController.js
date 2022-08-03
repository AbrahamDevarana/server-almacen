const ValeSalida = require('../models/ValeSalida')
const DetalleSalida = require('../models/DetalleSalida')
const Insumo = require('../models/Insumos')
const { validationResult } = require('express-validator')
const {validarTiempoEntrega} = require("../utils/validateDelivery")
const { Op } = require("sequelize");
const Users = require('../models/Users')
const {createNotification} = require('../utils/createNotification.js')


exports.getAllValeSalida = async (req, res) => {
    try {    

        // Obtener roles de usuario
        const {id} = req.user

        loggedUser = await Users.findOne({ where: { id } })
        .then( async user => {
            if (user.tipoUsuario_id === 3)  {
                await ValeSalida.findAll({ include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'], where: {
                    statusVale: {[Op.ne]: 6}
                }}).then(valeSalida => {
                    res.status(200).json({ valeSalida })
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
                })
            }else{
                await ValeSalida.findAll({ include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'], where: {userId: user.id}})
                .then(valeSalida => {
                    res.status(200).json({ valeSalida })
                })            
                .catch(error => {
                    res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
                })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getValeSalida = async (req, res) => {
    try {
        const { statusVale } = req.query
        const {id} = req.user

        loggedUser = await Users.findOne({ where: { id } })
        .then( async user => {
            if (user.tipoUsuario_id === 3)  {
                await ValeSalida.findAll({ include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'], where: {
                    statusVale: {[Op.and]: [{[Op.ne]: 6},  statusVale? { [Op.eq]: statusVale  } : {[Op.ne]: 6} ]}                     
                }}).then(valeSalida => {
                    res.status(200).json({ valeSalida })
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
                })
            }else{
                await ValeSalida.findAll({ include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'], where: {
                    statusVale: statusVale ? statusVale : {[Op.ne]: ''}, userId: user.id }})
                .then(valeSalida => {
                    res.status(200).json({ valeSalida })
                })            
                .catch(error => {
                    res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
                })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createValeSalida = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.mapped() });
    }
    const { almacenId, obraId, nivelId, zonaId, actividadId, personalId, statusVale, listaInsumos } = req.body
    const userId = req.user.id
    try {
        await ValeSalida.create({
            almacenId,
            obraId,
            nivelId,
            zonaId,
            actividadId,
            personalId,
            statusVale,
            userId,
        })
        .then( async valeSalida => {
            if(valeSalida){
                const detalleSalida = await DetalleSalida.bulkCreate(listaInsumos.map(insumo => ({
                    valeSalidaId: valeSalida.id,
                    insumoId: insumo.id,
                    cantidadSolicitada: insumo.cantidadSolicitada,
                    costo: insumo.costo,
                    total: insumo.total,
                })))    
                await ValeSalida.findOne({ where: { id: valeSalida.id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] })
                .then( valeSalida => {

                    // Buscar usuarios con rol almacen
                    Users.findAll({ where: { tipoUsuario_id: 3 } })
                    .then(almacenistas => {
                        const almacenistasArray = []
                        almacenistas.map(almacenista => {
                            almacenistasArray.push(almacenista.dataValues.id)
                            
                        })
                        createNotification(almacenistasArray, 'Vale de salida', `El usuario ${valeSalida.user.nombre} ha creado un vale de salida`)
                    })
                    .catch(error => {
                        console.log(error.message);
                    })

                    //TODO relacionar vale de salida con notificacion
                    res.status(200).json({ valeSalida, detalleSalida })
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al crear el vale de salida', error: error.message })
                })
                
            }else{
                res.status(404).json({ message: 'No hay vale de salida o no se creo correctamente' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al crear el vale de salida', error: error.message })
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateValeSalida = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }


    const { id } = req.params
    const { almacenId, obraId, nivelId, zonaId, actividadId, personalId, statusVale, listaInsumos } = req.body
    const userId = req.user.id

    const { listadoActualizar } = req.body
    
    try {
        const valeSalida = await ValeSalida.findOne({ where: { id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })

        if (valeSalida){
            if( valeSalida.statusVale === 1 || valeSalida.statusVale === 2 && valeSalida.userId === userId){
                    valeSalida.almacenId = almacenId ?? valeSalida.almacenId 
                    valeSalida.obraId = obraId ?? valeSalida.obraId
                    valeSalida.nivelId = nivelId ?? valeSalida.nivelId
                    valeSalida.zonaId = zonaId ?? valeSalida.zonaId
                    valeSalida.actividadId = actividadId ?? valeSalida.actividadId
                    valeSalida.personalId = personalId ?? valeSalida.personalId
                    valeSalida.statusVale = statusVale ?? valeSalida.statusVale
                    // valeSalida.userId = userId ?? valeSalida.userId

                    const detalleSalida = await DetalleSalida.destroy({ where: { valeSalidaId: valeSalida.id } }).catch(error => {
                        res.status(500).json({ message: 'Error al eliminar los detalles del vale de salida', error: error.message })
                    })
                    if(detalleSalida){
                        const detalleSalida = await DetalleSalida.bulkCreate(listaInsumos.map(insumo => ({
                            valeSalidaId: valeSalida.id,
                            insumoId: insumo.id,
                            cantidadSolicitada: insumo.cantidadSolicitada,
                        })))
                        res.status(200).json({ valeSalida, detalleSalida })
                    }else {
                        res.status(404).json({ message: 'Error al agregar los insumos al vale' })
                    }
                
            }else{
                // actualizar la cantidadEntregada con respecto a la listadoActualizar de DetalleSalida
                const detalleSalida = await DetalleSalida.findAll({ where: { valeSalidaId: valeSalida.id } }).catch(error => {
                    res.status(500).json({ message: 'Error al obtener los detalles del vale de salida', error: error.message })
                })
                if(detalleSalida){
                    detalleSalida.forEach(async (detalle) => {
                        const insumo = listadoActualizar.find(insumo => insumo.id === detalle.insumoId)
                        if(insumo){
                            detalle.cantidadEntregada = insumo.cantidadEntregada
                            await detalle.save()
                        }
                    })
                }
            }
        } else {
            res.status(404).json({ message: 'No hay vale de salida' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deliverValeSalida = async (req, res) => {

    const { id, valeSalidaId, insumoId, cantidadEntregada } = req.body

    try {
        const detalleSalida = await DetalleSalida.findOne({ where: { id, insumoId, valeSalidaId } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
        })

        // obtener vales de salida incluir insumos
        const valeSalida = await ValeSalida.findOne({ where: { id: valeSalidaId }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })

        if(valeSalida.statusVale !== 7 && valeSalida.statusVale !== 5 ){ // Si el vale de salida no se ha subido a enk o esta cancelado
            if(detalleSalida){ // Si hay detalle salida en el vale
                if(Number(detalleSalida.cantidadEntregada) + Number(cantidadEntregada) > Number(detalleSalida.cantidadSolicitada)){ // validar si la cantidad entregada es mayor a la cantidad solicitada
                    res.status(400).json({ message: 'La cantidad a entregar es mayor a la cantidad del insumo' })
                }else{
                    detalleSalida.cantidadEntregada = Number(detalleSalida.cantidadEntregada) + Number(cantidadEntregada)
                        if(Number(detalleSalida.cantidadSolicitada > 0 && Number(detalleSalida.cantidadSolicitada) > Number(detalleSalida.cantidadEntregada))){
                            detalleSalida.status = 2 // Parcialmente Entregado
                        }else{
                            // si la cantidad entregada es igual a la cantidad solicitada se ha entregado
                            if(Number(detalleSalida.cantidadSolicitada) === Number(detalleSalida.cantidadEntregada)){
                                detalleSalida.status = 3 // Entregado
                            }
                        }
                    await detalleSalida.save()

                    // Vale Salida
                    await ValeSalida.findOne({ where: { id: valeSalidaId }, include: DetalleSalida })
                    .then( async valeSalida => {
                        if (valeSalida.detalle_salidas.every( item => item.status === 3 )) { // si todos los detalles estan entregados
                            valeSalida.statusVale = 4
                        } else if (valeSalida.detalle_salidas.every( item => item.status === 1 )) { // si todos los detalles no se han entregado 
                            valeSalida.statusVale = 1
                        } else if (valeSalida.detalle_salidas.some( item => item.status !== 1 )) { // si alguno de los detalles se ha entregado
                            valeSalida.statusVale = 2
                        } else if (valeSalida.detalle_salidas.some( item => item.status === 4 )) { // si alguno de los detalles se ha cancelado
                            valeSalida.statusVale = 2
                        } 
                        await valeSalida.save()
                        res.status(200).json({ detalleSalida, valeSalida })
                    })
                    .catch(error => {
                        res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
                    })
                }         
            } else {
                res.status(400).json({ message: "No se encontro el detalle del vale de salida"})
            }
          
        } else {
            res.status(400).json({ message: "El vale se ha cerrado o ya se canceló."})
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.closeValeSalida = async (req, res) => {
    const { id, salidaEnkontrol } = req.body
    try {
        await ValeSalida.findOne({ where: { id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] })
        .then( async valeSalida => {
            if(valeSalida.statusVale === 4 || valeSalida.statusVale === 3){
                valeSalida.statusVale = 7
                valeSalida.salidaEnkontrol = salidaEnkontrol
                await valeSalida.save()
                res.status(200).json({ valeSalida })
            }else {
                res.status(400).json({ message: "El vale debe ser entregado completamente o paracialmente."})
            }            
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })    
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.cancelValeSalida = async (req, res) => {
    const { id, comentarios } = req.body
    try {
        await ValeSalida.findOne({ where: { id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] })
        .then( async valeSalida => {
            if(valeSalida.statusVale === 1 || valeSalida.statusVale === 2){
                valeSalida.statusVale = 5
                valeSalida.comentarios = comentarios

                // cancelar detalles de salida
                await DetalleSalida.update({ status: 4 }, { where: { valeSalidaId: id } })
                .catch(error => {
                    res.status(500).json({ message: 'Error al cancelar el vale de salida', error: error.message })
                })

                await valeSalida.save()
                res.status(200).json({ valeSalida })
            }else {
                res.status(400).json({ message: "El vale debe estar en estatus 1 o 2."})
            }            
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })    
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.cancelDetalleSalida = async (req, res) => {
    const { id, comentarios } = req.body
    try {
        await DetalleSalida.findOne({ where: { id } })
        .then( async detalleSalida => {
            if(detalleSalida.status === 1){
                detalleSalida.status = 4
                detalleSalida.comentarios = comentarios
                await detalleSalida.save()

                // Vale Salida
                await ValeSalida.findOne({ where: { id: detalleSalida.valeSalidaId }, include: DetalleSalida, include:Insumo })
                .then( async valeSalida => {
                    if(valeSalida.detalle_salidas.every( item => item.status === 4 )){
                        valeSalida.statusVale = 5
                        await valeSalida.save()
                    }
                    
                    res.status(200).json({ detalleSalida })
                }).catch(error => {
                    res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
                })
            }else {
                res.status(400).json({ message: "No se debe haber entregado ningún insumo para cancelar."})
            }            
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el detalle de salida', error: error.message })
        })    
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.completeValeSalida = async (req, res) => {
    const { id } = req.body
    try {
        await ValeSalida.findOne({ where: { id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] })
        .then( async valeSalida => {
            if(valeSalida.statusVale === 1 || valeSalida.statusVale === 2 || valeSalida.statusVale === 3){
                valeSalida.statusVale = 4
                await valeSalida.save()
                // completar detalles de salida
                await DetalleSalida.findAll({ where: { valeSalidaId: id } })
                .then( async detalleSalida => {
                    detalleSalida.forEach( async item => {
                        item.status = 3
                        item.cantidadEntregada = item.cantidadSolicitada
                        await item.save()
                    })
                })
                .then( async () => {
                    await ValeSalida.findOne({ where: { id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] })
                    .then( async valeSalida => {
                        res.status(200).json({ valeSalida })
                    }).catch(error => {
                        res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
                    })
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al completar el vale de salida', error: error.message })
                })               
            } else {
                res.status(400).json({ message: "El vale no debe estar cancelado o completado"})
            }            
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}