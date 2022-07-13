const ValeSalida = require('../models/ValeSalida')
const DetalleSalida = require('../models/DetalleSalida')

exports.getAllValeSalida = async (req, res) => {
    try {
        const valeSalida = await ValeSalida.findAll({ include: DetalleSalida }).catch(error => {
            res.status(500).json({ message: 'Error al obtener los vale de salida', error: error.message })
        })
        if(valeSalida && valeSalida.length > 0){
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
            console.log(error);
        })
        if(valeSalida){
            const detalleSalida = await DetalleSalida.bulkCreate(listaInsumos.map(insumo => ({
                valeSalidaId: valeSalida.id,
                insumoId: insumo.id,
                cantidad: insumo.cantidad,
                costo: insumo.costo,
                total: insumo.total,
            })))
            res.status(200).json({ valeSalida, detalleSalida })
        }else{
            res.status(404).json({ message: 'No hay vale de salida o no se creo correctamente' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateValeSalida = async (req, res) => {
    const { id } = req.params
    const { almacenId, obraId, nivelId, zonaId, actividadId, personalId, statusVale, listaInsumos } = req.body
    const userId = req.user.id

    const { listadoActualizar } = req.body
    
    try {
        const valeSalida = await ValeSalida.findOne({ where: { id } }).catch(error => {
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
                            cantidad: insumo.cantidad,
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
