const Unidad = require('../models/Unidad');
const validationResult = require('express-validator');

exports.getUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener las unidades', error: error.message })
        })
        if(unidades){
            res.status(200).json({ unidades })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getUnidad = async (req, res) => {
   const { id } = req.params
    try {
        const unidad = await Unidad.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la unidad', error: error.message })
        })
        if(unidad){
            res.status(200).json({ unidad })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createUnidad = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { nombre, nombreCorto, status } = req.body
    try {
        const unidad = await Unidad.create({
            nombre,
            nombreCorto,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la unidad', error: error.message })
        })
        if(unidad){
            res.status(200).json({ unidad })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateUnidad = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }


    const {id} = req.params
    const {nombre, nombreCorto, status} = req.body
    try{
        const unidad = await Unidad.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la unidad', error: error.message})
        })
        if(unidad){
            unidad.nombre = nombre ?? unidad.nombre
            unidad.nombreCorto = nombreCorto ?? unidad.nombreCorto
            unidad.status = status ?? unidad.status
            await unidad.save()
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteUnidad = async (req, res) => {
    const {id} = req.params
    try{
        const unidad = await Unidad.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la unidad', error: error.message})
        })
        if(unidad){
            await unidad.destroy()
            res.status(200).json({ unidad })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}