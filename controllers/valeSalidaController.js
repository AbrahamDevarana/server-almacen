const ValeSalida = require('../models/ValeSalida')
const DetalleSalida = require('../models/DetalleSalida')
const Insumo = require('../models/Insumos')
const { validationResult } = require('express-validator')
const {validarTiempoEntrega} = require("../utils/validateDelivery")


exports.getAllValeSalida = async (req, res) => {
    try {    
        // Obtener roles de usuario
        const {rolUsuario, id} = req.user

        const where = {}

        if (rolUsuario === 3)  {
            delete where.userId
            where.statusVale = !6
        }else{
            delete where.statusVale
            where.userId = id
        }



        const valeSalida = await ValeSalida.findAll({ include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] }, where).catch(error => {
            res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
        })
        if(valeSalida){
            res.status(200).json({ valeSalida })
        }else{
            res.status(404).json({ message: 'No hay vale de salida' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getValeSalida = async (req, res) => {
    const { id } = req.params
    try {
        const valeSalida = await ValeSalida.findOne({ where: { id }, include: DetalleSalida }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })
        if(valeSalida){
            res.status(200).json({ valeSalida })
        }else{
            res.status(404).json({ message: 'No hay vale de salida' })
        }
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
        const valeSalida = await ValeSalida.create({
            almacenId,
            obraId,
            nivelId,
            zonaId,
            actividadId,
            personalId,
            statusVale,
            userId,
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el vale de salida', error: error.message })
        })
        if(valeSalida){
            const detalleSalida = await DetalleSalida.bulkCreate(listaInsumos.map(insumo => ({
                valeSalidaId: valeSalida.id,
                insumoId: insumo.id,
                cantidadSolicitada: insumo.cantidadSolicitada,
                costo: insumo.costo,
                total: insumo.total,
            })))

            const valeSalidaLoaded = await ValeSalida.findOne({ where: { id: valeSalida.id }, include: [ { model: DetalleSalida, include:Insumo}, 'user', 'obra', 'nivel', 'zona', 'actividad', 'personal'] }).catch(error => {
                res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
            })
            res.status(200).json({ valeSalida: valeSalidaLoaded, detalleSalida })
        }else{
            res.status(404).json({ message: 'No hay vale de salida o no se creo correctamente' })
        }
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { id, valeSalidaId, insumoId, cantidadEntregada, comentarios } = req.body

    try {
        const detalleSalida = await DetalleSalida.findOne({ where: { id, insumoId, valeSalidaId } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
        })

        // obtener vales de salida incluir insumos
        const valeSalida = await ValeSalida.findOne({ where: { id: valeSalidaId }, include: DetalleSalida }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })

        

        
        if(valeSalida.statusVale !== 7 ){ // Si el vale de salida no esta cerrado
            if(validarTiempoEntrega(valeSalida)){ // validar cuanto tiempo se demora en entregar el insumo (24h)
                if(detalleSalida){
                    if(Number(detalleSalida.cantidadEntregada) + Number(cantidadEntregada) > Number(detalleSalida.cantidadSolicitada)){ // validar si la cantidad entregada es mayor a la cantidad solicitada
                        res.status(400).json({ message: 'La cantidad a entregar es mayor a la cantidad del insumo' })
                    }else{
                        detalleSalida.cantidadEntregada = Number(detalleSalida.cantidadEntregada) + Number(cantidadEntregada)
                        // si la cantidad entregada es menor que la cantidad solicitada se agrega comentario
                        if(comentarios){
                            detalleSalida.comentarios = comentarios
                            detalleSalida.status = 4 // Cancelado
                        }else{
                            if(Number(detalleSalida.cantidadSolicitada > 0 && Number(detalleSalida.cantidadSolicitada) > Number(detalleSalida.cantidadEntregada))){
                                detalleSalida.status = 2 // Parcialmente Entregado
                            }else{
                                // si la cantidad entregada es igual a la cantidad solicitada se cambia el estatus del insumo a 6
                                if(Number(detalleSalida.cantidadSolicitada) === Number(detalleSalida.cantidadEntregada)){
                                    detalleSalida.status = 3 // Entregado
                                }
                            }
                        }
                        
                        await detalleSalida.save()

                        // Vale Salida
                        const updatedValeSalida = await ValeSalida.findOne({ where: { id: valeSalidaId }, include: DetalleSalida }).catch(error => {
                            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
                        })

                        console.log('Estatus Vale Salida 1: Sin Entregar | 2: Parcialmente Entregado Abierto | 3: Parcialmente Entregado Cerrado | 4: Entregado | 5: Cancelado | 6: Borrador | 7: Cerrado ');
                        console.log('Estatus detalleSalida 1: Sin Entregar | 2: Parcialmente Entregado | 3: Entregado | 4: Cancelado');

                        
                        updatedValeSalida.detalle_salidas.map( item => ( console.log('Item Detalle Salida Status', item.status) ))
                        updatedValeSalida.detalle_salidas.map( item => {( console.log('Item Detalle Salida Status', item.status) )})
                        console.log('Entregado 4? ', updatedValeSalida.detalle_salidas.every( item => item.status === 3 )) // Entregados 
                        console.log('Parcialmente 2? ', updatedValeSalida.detalle_salidas.some( item => item.status !== 1 )) // Parcialmente Abierto 
                        console.log('Sin entregar 1? ', updatedValeSalida.detalle_salidas.every( item => item.status === 1 )) // Sin Entregar
                        console.log('Parcialmente 2? ', updatedValeSalida.detalle_salidas.some( item => item.status === 4 )) // Parcialmente Entregado Cerrado


                        if (updatedValeSalida.detalle_salidas.every( item => item.status === 3 )) {
                            updatedValeSalida.statusVale = 4
                        } else if (updatedValeSalida.detalle_salidas.every( item => item.status === 1 )) {
                            updatedValeSalida.statusVale = 1
                        } else if (updatedValeSalida.detalle_salidas.some( item => item.status !== 1 )) {
                            updatedValeSalida.statusVale = 2
                        } else if (updatedValeSalida.detalle_salidas.some( item => item.status === 4 )) {
                            updatedValeSalida.statusVale = 2
                        }

                        await updatedValeSalida.save()

                        res.status(200).json({ insumo:detalleSalida, valeSalida:updatedValeSalida })
                    }
                    
                } else {
                    res.status(400).json({ message: "No se encontro el detalle del vale de salida"})
                }
            } else {

                if(valeSalida.statusVale === 2 ){
                    valeSalida.statusVale = 3 // Parcialmente Entregado Cerrado
                } else {
                    valeSalida.statusVale = 7 // Cerrado
                }
                await valeSalida.save()
                res.status(400).json({ message: 'El insumo fue solicitado hace más de 24h, se cierra el vale', valeSalida })
            }
        } else {
            res.status(400).json({ message: "El vale se ha cerrado"})
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

