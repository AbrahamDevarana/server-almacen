const Role = require('../models/Role')
const Users = require('../models/Users')

exports.getUser = async (req, res) => {
    const {id} = req.params
    try {

        const usuario = await Users.findOne({ where: { id, status: true } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })

        if(usuario){
            res.status(200).json({ usuario })
        }else{
            res.status(404).json({ message: 'El usuario no existe o ha sido desactivado' })
        }   
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const usuarios = await Users.findAll({ where: { status: true }, include: Role }).catch(error => {
            res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message })
        })
        if(usuarios && usuarios.length > 0){
            res.status(200).json({ usuarios })
        }else{
            res.status(404).json({ message: 'No hay usuarios registrados' })
        }
    
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createUser = async (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, tipoUsuario_id, puesto_id } = req.body

    try {
        const usuario = await Users.create({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            email: email ?? '',
            password: '123456',
            telefono,
            tipoUsuario_id,
            puesto_id
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el usuario', error: error.message })
        })
        
        console.log(usuario);
        if(usuario){
            delete usuario.dataValues.password
            
            res.status(200).json({ usuario })
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }   
}

exports.updateUser = async (req, res) => {
    const { id } = req.params
    const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, tipoUsuario_id, puesto_id, status } = req.body

    try {

        const usuario = await Users.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
        
        if(usuario){
            usuario.nombre = nombre ?? usuario.nombre
            usuario.apellidoPaterno = apellidoPaterno ?? usuario.apellidoPaterno
            usuario.apellidoMaterno = apellidoMaterno ?? usuario.apellidoMaterno
            usuario.email = email ?? usuario.email
            usuario.telefono = telefono ?? usuario.telefono
            usuario.tipoUsuario_id = tipoUsuario_id ?? usuario.tipoUsuario_id
            usuario.puesto_id = puesto_id ?? usuario.puesto_id
            usuario.status = status ?? usuario.status

            await usuario.save().catch(error => {
                res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
            })

            res.status(200).json({ usuario })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params

   try{
        const usuario = await Users.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
        if(usuario){
            await usuario.destroy().catch(error => {
                res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message })
            })

            res.status(200).json({ message: 'Usuario eliminado', usuario })
        }else{
            res.status(404).json({ message: 'El usuario no existe' })
        }
   } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
   }
}