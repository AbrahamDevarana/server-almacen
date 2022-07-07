const Actividad = require('../models/Actividad');

exports.getActividades = async (req, res) => {
    try {
        const actividades = await Actividad.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener las actividades', error: error.message })
        })
        if(actividades && actividades.length > 0){
            res.status(200).json({ actividades })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getActividad = async (req, res) => {
    const { id } = req.params
    try {
        const actividad = await Actividad.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la actividad', error: error.message })
        })
        if(actividad){
            res.status(200).json({ actividad })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createActividad = async (req, res) => {
    const { nombre, descripcion } = req.body
    try {
        const actividad = await Actividad.create({
            nombre,
            descripcion
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la actividad', error: error.message })
        })
        if(actividad){
            res.status(200).json({ actividad })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateActividad = async (req, res) => {
    const {id} = req.params
    const {nombre, descripcion} = req.body

    try{
        const actividad = await Actividad.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la actividad', error: error.message})
        })
        if(actividad){
            actividad.nombre = nombre ?? actividad.nombre
            actividad.descripcion = descripcion ?? actividad.descripcion
            await actividad.save()
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteActividad = async (req, res) => {
    const {id} = req.params
    try{
        const actividad = await Actividad.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la actividad', error: error.message})
        })
        if(actividad){
            await actividad.destroy()
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}