const { Role } = require('../models')
const Permiso = require('../models/Permisos')
const Users = require('../models/Users')

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
    
    const {id} = req.user
    
    try{
        
        await Users.findOne({ where: { id }}).then( async user => {
            // obtener permisos por roles de la tabla pivote
            await Permiso.findAll({ include: { model: Role, where: { id:user.tipoUsuario_id } } })
            .then(permisos => {
                if(permisos){
                    res.status(200).json({ permisos })
                }
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al obtener los permisos', error: error.message })
            })

        }).catch( (error) => {
            res.status(500).json({ message: 'Error al obtener los permisos del usuario', error: error.message })
        })



    } catch ( error ) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }


}