const { validationResult } = require('express-validator');
const Etapa = require('../models/Etapas');
const { Op } = require('sequelize');


exports.getEtapas = async (req, res) => {

    const { search } = req.query
    const where = search ? {
        nombre: {
            [Op.like]: `%${search}%`
            }
        } : {}
    try {
            
        await Etapa.findAll({ where }
        ).then(etapas => {
            res.status(200).json({ etapas })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener las etapas', error: error.message })
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getEtapa = async (req, res) => {
    const { id } = req.params
    try {
        await Etapa.findOne({ where: { id } }).then(etapa => {
            res.status(200).json({ etapa })
        }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la etapa', error: error.message })
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createEtapa = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.array() });
    }

    const { nombre, descripcion } = req.body
    try {
        const etapa = await Etapa.create({
            nombre,
            descripcion,
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la etapa', error: error.message })
        })
        if (etapa) {
            res.status(200).json({ etapa })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateEtapa = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.array() });
    }

    const { id } = req.params
    const { nombre, descripcion, status } = req.body
    try {
        const etapa = await Etapa.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la etapa', error: error.message })
        })
        if (etapa) {
            etapa.nombre = nombre ?? etapa.nombre
            etapa.descripcion = descripcion ?? etapa.descripcion
            etapa.status = status ?? etapa.status
            await etapa.save()
            res.status(200).json({ etapa })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteEtapa = async (req, res) => {
    const { id } = req.params
    try {
        await Etapa.findOne({ where: { id } })
        .then(etapa => {
            etapa.status = false
            etapa.save()
            res.status(200).json({ etapa })
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener la etapa', error: error.message })
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}