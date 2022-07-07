const Unidad = require('../models/Unidad');

exports.getUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener las unidades', error: error.message })
        })
        if(unidades && unidades.length > 0){
            res.status(200).json({ unidades })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
