const centroCosto = require('../models/CentroCosto');

exports.getCentrosCosto = async (req, res) => {
    try {
        const centroCostos = await centroCosto.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los centros de costos', error: error.message })
        })
        if(centroCostos && centroCostos.length > 0){
            res.status(200).json({ centroCostos })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}