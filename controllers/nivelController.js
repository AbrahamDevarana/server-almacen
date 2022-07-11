const Actividad = require('../models/Actividad')
const Nivel = require('../models/Nivel')
const Zona = require('../models/Zona')


exports.getNiveles = async (req, res) => {
    try {
        const niveles = await Nivel.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los niveles', error: error.message })
        })
        if(niveles && niveles.length > 0){
            res.status(200).json({ niveles })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
exports.getNivel = async ( req, res ) => {

    const {id} = req.params
    try {
        
        const nivel = await Nivel.findOne({ where: { id },  include: [ Zona, Actividad ] }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el nivel', error: error.message })
        })
        if(nivel){
            res.status(200).json({ nivel })
        }else{
            res.status(404).json({ message: 'Nivel no encontrado' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
exports.createNivel = async (req, res) => {
    const { nombre, status, zonas, actividades } = req.body
    try {
        const nivel = await Nivel.create({
            nombre,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el nivel', error: error.message })
        })
        if(nivel){
            if(zonas && zonas.length > 0){
                await nivel.setZonas(zonas)
            }
            if(actividades && actividades.length > 0){
                await nivel.setActividades(actividades)
            }
            res.status(200).json({ nivel })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
exports.updateNivel = async (req, res) => {
    const { id } = req.params
    const { nombre, status, zonas, actividades } = req.body
    try {
        const nivel = await Nivel.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el nivel', error: error.message })
        })
        if(nivel){
            nivel.nombre = nombre ?? nivel.nombre
            nivel.status = status ?? nivel.status
            nivel.save()

            if(zonas && zonas.length > 0){
                await nivel.setZonas(zonas)
            }
            if(actividades && actividades.length > 0){
                await nivel.setActividades(actividades)
            }

            res.status(200).json({ nivel })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
exports.deleteNivel = async (req, res) => {
    const { id } = req.params
    try {
        const nivel = await Nivel.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el nivel', error: error.message })
        })
        if(nivel){
            nivel.destroy()
            res.status(200).json({ nivel })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}