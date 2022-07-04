const Users = require('../models/Users')

exports.getUser = (req, res) => {
    const {id} = req.params
    try {

        const user = Users.findOne({ where: { id, status: true } }).catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Error al obtener el usuario' })
        })

        if(user && user.length > 0){
            res.status(200).json({ user })
        }else{
            res.status(404).json({ message: 'El usuario no existe o ha sido desactivado' })
        }   
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error del servidor' })
    }
}

exports.getUsers = (req, res) => {
    try {
        const users = Users.findAll()

        if(users && users.length > 0){
            res.status(200).json({ users })
        }else{
            res.status(404).json({ message: 'No hay usuarios registrados' })
        }
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.createUser = (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, tipoUsuario_id, puesto_id } = req.body

    try {
        const usuario = Users.create({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            email,
            password: '123456',
            telefono,
            tipoUsuario_id,
            puesto_id
        }).catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Error al crear el usuario' })
        })

        console.log(usuario);

        if(usuario){
            res.status(200).json({ usuario })
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }   
}

exports.updateUser = (req, res) => {
}

exports.deleteUser = (req, res) => {
}