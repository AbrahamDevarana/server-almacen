const Role = require('../models/Role')


exports.getRole = async (req, res) => {
    const {id} = req.params
    try {
        const role = await Role.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el rol', error: error.message })
        })
        if(role){
            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los roles', error: error.message })
        })
        if(roles){
            res.status(200).json({ roles })
        }else {
            res.status(404).json({ message: 'No hay roles registrados' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createRole = async (req, res) => {
    const { nombre, descripcion, status } = req.body

    try {
        const role = await Role.create({
            nombre,
            descripcion,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el rol', error: error.message })
        })
        if(role){
            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateRole = async (req, res) => {
    const { id } = req.params
    const { nombre, descripcion, status } = req.body
    try {
        const role = await Role.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el rol', error: error.message })
        })
        if(role){
            role.nombre = nombre ?? role.nombre
            role.descripcion = descripcion ?? role.descripcion
            role.status = status ?? role.status
            await role.save()
            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }

}

exports.deleteRole = async (req, res) => {

    const { id } = req.params
    try {
        const role = await Role.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el rol', error: error.message })
    })
        if(role){
            await role.destroy()
            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }

}