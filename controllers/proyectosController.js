const { validationResult } = require('express-validator');
const Proyectos = require('../models/Proyectos');
const { Op } = require('sequelize');

exports.getProyectos = async (req, res) => {
    try {
        await Proyectos.findAll().then(proyectos => {
            res.status(200).json({ proyectos });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudieron obtener los proyectos' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudieron obtener los proyectos' });
    }
}

exports.getProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        await Proyectos.findByPk(id).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo obtener el proyecto' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo obtener el proyecto' });
    }
}

exports.createProyecto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.map() });
    }

    try {
        const { nombre, clave, logo } = req.body;
        await Proyectos.create({
            nombre,
            clave,
            logo
        }).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo crear el proyecto', error: error.message});
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo crear el proyecto' });
    }
}

exports.updateProyecto = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.map() });
    }

    try {
        const { id } = req.params;
        const { nombre, clave, logo } = req.body;
        await Proyectos.update({
            nombre,
            clave,
            logo
        }, {
            where: {
                id
            }
        }).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo actualizar el proyecto' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo actualizar el proyecto' });
    }
}

exports.deleteProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        await Proyectos.update({
            status: false 
        }, {
            where: {
                id
            }
        }).then(proyecto => {
            res.status(200).json({ proyecto });
        }).catch(error => {
            console.log(error);
            res.status(500).json({ msg: 'No se pudo eliminar el proyecto' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'No se pudo eliminar el proyecto' });
    }
}