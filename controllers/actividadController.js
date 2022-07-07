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

