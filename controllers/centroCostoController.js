const CentroCosto = require('../models/CentroCosto');

exports.getCentrosCosto = async (req, res) => {
    try {
        const centroCostos = await CentroCosto.findAll().catch(error => {
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

exports.getCentroCosto = async (req, res) => {

    const { id } = req.params;
    try {
        const centroCosto = await CentroCosto.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el centro de costo', error: error.message })
        })
        if(centroCosto){
            res.status(200).json({ centroCosto })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createCentroCosto = async (req, res) => {
    
    const { nombre, nombreCorto, status} = req.body;
    try {
        const centroCosto = await CentroCosto.create({
            nombre,
            nombreCorto,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el centro de costo', error: error.message })
        })
        if(centroCosto){
            res.status(200).json({ centroCosto })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateCentroCosto = async (req, res) => {
   const {id} = req.params;
    const {nombre, nombreCorto, status} = req.body;
    try{
        const centroCosto = await CentroCosto.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el centro de costo', error: error.message})
        })
        if(centroCosto){
            centroCosto.nombre = nombre ?? centroCosto.nombre
            centroCosto.nombreCorto = nombreCorto ?? centroCosto.nombreCorto
            centroCosto.status = status ?? centroCosto.status
            await centroCosto.save()
            res.status(200).json({centroCosto})
        }
    }
    catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }

}

exports.deleteCentroCosto = async (req, res) => {
   const {id} = req.params;
    try{
        const centroCosto = await CentroCosto.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el centro de costo', error: error.message})
        })
        if(centroCosto){
            await centroCosto.destroy()
            res.status(200).json({centroCosto})
        }
    }
    catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }
}
