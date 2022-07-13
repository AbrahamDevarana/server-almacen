const Insumo = require('../models/Insumos')


exports.getInsumos = async (req, res) => {
    try {
        const insumos = await Insumo.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los insumos', error: error.message })
        })
        if(insumos && insumos.length > 0){
            res.status(200).json({ insumos })
        }else{
            res.status(404).json({ message: 'No hay insumos' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getInsumo = async (req, res) => {
    const { id } = req.params
    try {
        const insumo = await Insumo.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
        })
        if(insumo){
            res.status(200).json({ insumo })
        }else{
            res.status(404).json({ message: 'No hay insumo' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createInsumo = async (req, res) => {
    const { claveEnk, centroCosto, nombre, unidadMedida, status } = req.body
    try {
        const insumo = await Insumo.create({
            nombre,
            claveEnk,
            centroCosto,
            unidadMedida,
            status,
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el insumo', error: error.message })
        })
        if(insumo){
            res.status(200).json({ insumo })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}


exports.updateInsumo = async (req, res) => {
    const {id} = req.params
    const {claveEnk, centroCosto, nombre, unidadMedida, status} = req.body
    try{
        const insumo = await Insumo.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el insumo', error: error.message})
        })
        if(insumo){
            insumo.nombre = nombre ?? insumo.nombre
            insumo.claveEnk = claveEnk ?? insumo.claveEnk
            insumo.centroCosto = centroCosto ?? insumo.centroCosto
            insumo.unidadMedida = unidadMedida ?? insumo.unidadMedida
            insumo.status = status ?? insumo.status
            await insumo.save()
            res.status(200).json({insumo})
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}


exports.deleteInsumo = async (req, res) => {
    const {id} = req.params
    try{
        const insumo = await Insumo.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el insumo', error: error.message})
        })
        if(insumo){
            await insumo.destroy()
            res.status(200).json({insumo})
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}