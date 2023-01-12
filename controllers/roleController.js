const Role = require('../models/Role')
const { validationResult } = require('express-validator')
const Permisos = require('../models/Permisos')
const { Op } = require('sequelize')


exports.getRole = async (req, res) => {
    const {id} = req.params
    try {
        const role = await Role.findOne({ where: { id }, include: Permisos }).catch(error => {
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


    const { search } = req.query
    const where = search ? 
    {
        [Op.or]: [
            { nombre: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
        ]
    }
    : 
    {}
    
    where.status = true

    try {
        await Role.findAll({ include: Permisos, where }).then(roles => {
            res.status(200).json({ roles })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener los roles', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }
    const { nombre, descripcion, status, permisos} = req.body

    try {
        const role = await Role.create({
            nombre,
            descripcion,
            status
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el rol', error: error.message })
        })
        if(role){
            await role.setPermisos(permisos)
            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateRole = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }


    const { id } = req.params
    const { nombre, descripcion, status, permisos } = req.body
    try {
        const role = await Role.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el rol', error: error.message })
        })
        if(role){
            role.nombre = nombre ?? role.nombre
            role.descripcion = descripcion ?? role.descripcion
            role.status = status ?? role.status
            await role.save()

            await role.setPermisos(permisos)

            res.status(200).json({ role })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }

}

exports.deleteRole = async (req, res) => {

    const { id } = req.params
    try {
        await Role.findOne({ where: { id } }).then(role => {
            if(role.id !== 3){
                role.update({status: 0})
                res.status(200).json({ role })
            } else {
                res.status(404).json({ message: 'Este rol no se puede borrar' })
            }
    })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener el rol', error: error.message })
    })

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }

}