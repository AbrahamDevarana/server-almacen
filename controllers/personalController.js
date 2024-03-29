const Personal = require('../models/Personal');
const Users = require('../models/Users');
const { validationResult } = require('express-validator')


exports.createPersonal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { nombre, apellidoPaterno, apellidoMaterno, especialidad } = req.body;
    try {
        await Personal.create({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            userId: req.user.id,
            especialidad
        })
        .then( async personal => {
            await Personal.findOne({ where: { id: personal.id }, include: Users })
            .then( personal => {
                res.status(200).json({ personal });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
            })
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al crear el personal', error: error.message });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }   
}

exports.updatePersonal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.array() });
    }

    const { id } = req.params;
    const { nombre, apellidoPaterno, apellidoMaterno, especialidad, status} = req.body;

    try {
        const personal = await Personal.findOne({ where: { id }, include: Users }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el personal', error: error.message });
        });

        if(personal.userId === req.user.id || req.user.suAdmin === true){
            if (personal) {
                personal.nombre = nombre ?? personal.nombre;
                personal.apellidoPaterno = apellidoPaterno ?? personal.apellidoPaterno;
                personal.apellidoMaterno = apellidoMaterno ?? personal.apellidoMaterno;
                personal.especialidad = especialidad ?? personal.especialidad;
                personal.status = status ?? personal.status;

                await personal.save().catch(error => {
                    res.status(500).json({ message: 'Error al actualizar el personal', error: error.message });
                });

                res.status(200).json({ personal });
            }else{
                res.status(500).json({ message: 'Error al actualizar el personal' });
            }
        }else{
            res.status(500).json({ message: 'No tienes permisos para actualizar este personal' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }   
}

exports.getPersonal = async (req, res) => {
    const { id } = req.params;

    try {
        const personal = await Personal.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el personal', error: error.message });
        });

        if (personal) {
            res.status(200).json({ personal });
        }else{
            res.status(500).json({ message: 'Error al obtener el personal' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }   
}

exports.getAllPersonal = async (req, res) => {

    try {

        const personal = await Personal.findAll({ where: { status: 1 }, include: Users}).catch(error => {
            res.status(500).json({ message: 'Error al obtener los personales', error: error.message });
        });

        if (personal) {
            res.status(200).json({ personal });
        }else{
            res.status(500).json({ message: 'Error al obtener los personales' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }   
}

exports.deletePersonal = async (req, res) => {
    const { id } = req.params;

    try {
        await Personal.findOne({ where: { id } })
        .then( async personal => {
            if(personal.userId === req.user.id || req.user.suAdmin === true){
                await personal.update({status: 0})
                .then( () => {
                    res.status(200).json({ personal });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al eliminar el personal', error: error.message });
                });
            }else{
                res.status(500).json({ message: 'No tienes permisos para eliminar este personal' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener el personal', error: error.message });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }   
}