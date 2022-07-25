const ValeSalida = require('../models/ValeSalida')
const DetalleSalida = require('../models/DetalleSalida')
const Insumo = require('../models/Insumos')
const { validationResult } = require('express-validator')


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
        const insumo = await DetalleSalida.findOne({ where: { id, insumoId, valeSalidaId } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
        })

        // obtener vales de salida incluir insumos
        const valeSalida = await ValeSalida.findOne({ where: { id: valeSalidaId }, include: DetalleSalida }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el vale de salida', error: error.message })
        })
        
        if(insumo){

            // validar si la cantidad entregada es mayor a la cantidad solicitada
            if(Number(insumo.cantidadEntregada) + Number(cantidadEntregada) > Number(insumo.cantidadSolicitada)){
                console.log(cantidadEntregada)
                console.log(insumo.cantidadEntregada)
                console.log(insumo.cantidadSolicitada)
                res.status(400).json({ message: 'La cantidad a entregar es mayor a la cantidad del insumo' })
            }

            // validar cuanto tiempo se demora en entregar el insumo, si es mayor a 24 horas, se cambia el estatus del insumo a 3
            if(!validarTiempoEntrega(insumo)){
                insumo.status = 3
                valeSalida.statusVale = 3
                res.status(400).json({ message: 'El insumo se demora en entregarse, se cierra el vale' })
            }
          
            insumo.cantidadEntregada = Number(insumo.cantidadEntregada) + Number(cantidadEntregada)

            // si la cantidad entregada es menor que la cantidad solicitada se agrega comentario
            if(Number(insumo.cantidadEntregada) < Number(insumo.cantidadSolicitada)){
                insumo.comentarios = comentarios
                insumo.status = 2
            }


            // si la cantidad entregada es igual a la cantidad solicitada se cambia el estatus del insumo a 6
            if(Number(insumo.cantidadSolicitada) === Number(insumo.cantidadEntregada) || Number(cantidadEntregada) === Number(insumo.cantidadSolicitada)){
                insumo.status = 6
            }

            await insumo.save()
            await validateVale(valeSalida);
            res.status(200).json({ insumo, valeSalida })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

// Valida todos los insumos, si ya fueron entregados, entonces cambia el estatus del vale a 6 sino a 3
async function validateVale(valeSalida) {
    const insumos = valeSalida.detalle_salidas
    if (insumos.length > 0) {
        const insumosEntregados = insumos.filter(insumo => insumo.status !== 6)
        if (insumosEntregados.length === insumos.length) {
            valeSalida.statusVale = 2
        } else {
            valeSalida.statusVale = 6
        }
    }

    await valeSalida.save()
}

// Valida si el tiempo de entrega del insumo es mayor a 24 horas 
function validarTiempoEntrega (insumo) {
    const fechaEntrega = new Date()
    const fechaSolicitud = new Date(insumo.createdAt)
    const diferencia = fechaEntrega.getTime() - fechaSolicitud.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    if(dias > 1){
        return false // no se entrega el insumo
    }
    return true // se entrega el insumo
}
