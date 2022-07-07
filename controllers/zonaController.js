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