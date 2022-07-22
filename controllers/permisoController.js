const Permiso = require('../models/Permisos')

exports.getPermisos = async (req, res) => {
    try {
        const permisos = await Permiso.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los permisos', error: error.message })
        })
        if(permisos){
            res.status(200).json({ permisos })
        }else{
            res.status(404).json({ message: 'Permisos no encontrados' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getPermiso = async ( req, res ) => {
    
    const {id} = req.params
    try {
        
        const permiso = await Permiso.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el permiso', error: error.message })
        })
        if(permiso){
            res.status(200).json({ permiso })
        }else{
            res.status(404).json({ message: 'Permiso no encontrado' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}