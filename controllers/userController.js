const Role = require('../models/Role')
const Users = require('../models/Users')
const { validationResult } = require('express-validator')
const { mailNewUser } = require('../email/Users')
const Permisos = require('../models/Permisos')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')


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

    const { search } = req.query
    const where = search ? 
    {
        [Op.or]: [
            { nombre: { [Op.like]: `%${search}%` } },
            { apellidoPaterno: { [Op.like]: `%${search}%` } },
            { apellidoMaterno: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { telefono: { [Op.like]: `%${search}%` } },
            { puesto: { [Op.like]: `%${search}%` } },
            { '$role.nombre$': { [Op.like]: `%${search}%` } },
        ]
    }
    : 
    {}
    
    where.status = true

    try {
        await Users.findAll( { where, include: { model: Role, include: Permisos } } ).then(usuarios => {
            res.status(200).json({ usuarios })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message })
        })
       
    
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, tipoUsuario_id, puesto, password, esInterno} = req.body

    const dummyPassword = 'notPassword'
    const safePassword = password ? bcrypt.hashSync(password, 10) : bcrypt.hashSync(dummyPassword, 10)
    

    try {
        const existsUser = await Users.findOne({ where: { email } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
    
        if(existsUser){
            res.status(400).json({ message: 'El usuario ya existe' })
        }else{
            const usuario = await Users.create({
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                email,
                password: safePassword,
                telefono: telefono ?? '',
                tipoUsuario_id,
                puesto,
                esInterno
            }).catch(error => {
                res.status(500).json({ message: 'Error al crear el usuario', error: error.message })
            })
            if(usuario){
                delete usuario.dataValues.password
                usuario.getDataValue('Role', await usuario.getRole())
                
                mailNewUser(usuario)

                const userLoaded = await Users.findOne({ where: { id: usuario.id }, include: Role }).catch(error => {
                    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
                })
                res.status(200).json({ usuario:userLoaded })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }   
}

exports.updateUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }


    
    const { id } = req.params
    const { nombre, apellidoPaterno, apellidoMaterno, email, telefono, tipoUsuario_id, puesto, status, esInterno, password } = req.body
    
    const safePassword = password ? bcrypt.hashSync(password, 10) : null
    try {

        const usuario = await Users.findOne({ where: { id }, include: Role }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
        })
        
        if(usuario){
            usuario.nombre = nombre ?? usuario.nombre
            usuario.apellidoPaterno = apellidoPaterno ?? usuario.apellidoPaterno
            usuario.apellidoMaterno = apellidoMaterno ?? usuario.apellidoMaterno
            usuario.email = email ?? usuario.email
            usuario.telefono = telefono ?? usuario.telefono
            usuario.tipoUsuario_id = tipoUsuario_id ?? usuario.tipoUsuario_id
            usuario.puesto = puesto ?? usuario.puesto
            usuario.status = status ?? usuario.status
            usuario.password = safePassword ?? usuario.password

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
            await usuario.update({status: 0}).catch(error => {
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