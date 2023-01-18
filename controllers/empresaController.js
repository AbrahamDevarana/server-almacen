const Empresa = require('../models/Empresa');
const { validationResult } = require('express-validator');


exports.getEmpresas = async (req, res) => {
    try {
        await Empresa.findAll({ where: { status: 1 }}).then(empresas => {
            res.status(200).json({ empresas })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener las empresas', error: error.message })
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}
exports.getEmpresa = async (req, res) => {
    const { id } = req.params
    try {
        await Empresa.findOne({ where: { id } }).then(empresa => {
            res.status(200).json({ empresa })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la empresa', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createEmpresa = async (req, res) => {
        
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.array() });
    }

    const { nombreCompleto, nombreCorto, rfc, direccion, telefono, status } = req.body
    try {
        await Empresa.create({
            nombreCompleto,
            nombreCorto,
            rfc,
            direccion,
            telefono,
            status
        }).then(empresa => {
            res.status(200).json({ empresa })
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la empresa', error: error.message })
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateEmpresa = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.array() });
    }

    const { id } = req.params
    const { nombreCompleto, nombreCorto, rfc, direccion, telefono, status } = req.body
    try {
        await Empresa.update({
            nombreCompleto,
            nombreCorto,
            rfc,
            direccion,
            telefono,
            status
        }, { where: { id } }).then(empresa => {
            res.status(200).json({ empresa })
        }).catch(error => {
            res.status(500).json({ message: 'Error al actualizar la empresa', error: error.message })
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteEmpresa = async (req, res) => {
    const { id } = req.params
    try {
        await Empresa.update({ status: 0 }, { where: { id } }).then(empresa => {
            res.status(200).json({ empresa })
        }).catch(error => {
            res.status(500).json({ message: 'Error al eliminar la empresa', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}