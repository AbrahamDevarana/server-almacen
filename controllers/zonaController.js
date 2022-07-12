const Zona = require('../models/Zona')


exports.getZonas = async (req, res) => {
    try {
        const zonas = await Zona.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener las zonas', error: error.message })
        })
        if(zonas && zonas.length > 0){
            res.status(200).json({ zonas })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getZona = async (req, res) => {
    const { id } = req.params
    try {
        const zona = await Zona.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la zona', error: error.message })
        })
        if(zona){
            res.status(200).json({ zona })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createZona = async (req, res) => {
   const { nombre, status } = req.body
    try {
        const zona = await Zona.create({
            nombre,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la zona', error: error.message })
        })
        if(zona){
            res.status(200).json({ zona })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateZona = async (req, res) => {
    const {id} = req.params
    const {nombre, status} = req.body

    try{
        const zona = await Zona.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la zona', error: error.message})
        })
        if(zona){
            zona.nombre = nombre ?? zona.nombre
            zona.status = status ?? zona.status
            await zona.save()
            res.status(200).json({zona})
        }
    }
    catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }
}

exports.deleteZona = async (req, res) => {
   const {id} = req.params
    try{
        const zona = await Zona.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la zona', error: error.message})
        })
        if(zona){
            await zona.destroy()
            res.status(200).json({zona})
        }
    }catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }
}
