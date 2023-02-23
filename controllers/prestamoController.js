const Prestamos = require('../models/Prestamos');
const { validationResult } = require('express-validator');
const { Op, where } = require('sequelize');
const  DetalleSalida  = require('../models/DetalleSalida');
const Insumo = require('../models/Insumos');
const Users = require('../models/Users');
const ValeSalida  = require('../models/ValeSalida');

exports.getAllPrestamos = async (req, res) => {

    const { id } = req.user;
    const { search } = req.query;

    const whereSearch = search ? {
        [Op.or]: [
            { '$residente.nombre$': { [Op.like]: `%${search}%` } },
            { '$residente.apellidoPaterno$': { [Op.like]: `%${search}%` } },
            { '$residente.apellidoMaterno$': { [Op.like]: `%${search}%` } },
            { '$owner.nombre$': { [Op.like]: `%${search}%` } },
            { '$owner.apellidoPaterno$': { [Op.like]: `%${search}%` } },
            { '$owner.apellidoMaterno$': { [Op.like]: `%${search}%` } },
            { '$detalle_salida.insumo.nombre$': { [Op.like]: `%${search}%` } },   
        ]
    } : {};
   
    try {
         
        await Prestamos.findAll({ 
            include: [{ 
                model: DetalleSalida, 
                attributes: ['id', 'cantidadSolicitada'],
                include: { 
                    model: Insumo,
                    attributes: ['id', 'nombre']
                }}, 
                {
                    model: Users,
                    attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture'],
                    as: 'residente'
                },
                {
                    model: Users,
                    attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture'],
                    as: 'owner'
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            where : {
                //  [Op.or]: [{ 'belongsTo': id }, { 'deliverTo': id }],
                // [Op.not]: {'$detalle_salida.id$' : null }
               [Op.and]: [
                    { [Op.or]: [{ 'belongsTo': id }, { 'deliverTo': id }] },
                    { '$detalle_salida.id$' : { [Op.not]: null } },
                    whereSearch,
               ]
            },
            order: [['id', 'DESC']] 
        })
        .then( prestamos => {
            res.status(200).json({ prestamos });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener los prestamos', error: error.message });
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

exports.getFullPrestamos = async (req, res) => {

    const { search } = req.query;

    const whereSearch = search ? {
        [Op.or]: [
            { '$residente.nombre$': { [Op.like]: `%${search}%` } },
            { '$residente.apellidoPaterno$': { [Op.like]: `%${search}%` } },
            { '$residente.apellidoMaterno$': { [Op.like]: `%${search}%` } },
            { '$owner.nombre$': { [Op.like]: `%${search}%` } },
            { '$owner.apellidoPaterno$': { [Op.like]: `%${search}%` } },
            { '$owner.apellidoMaterno$': { [Op.like]: `%${search}%` } },
            { '$detalle_salida.insumo.nombre$': { [Op.like]: `%${search}%` } },   
        ]
    } : {};

    try {
         
        await Prestamos.findAll({ 
            include: [{ 
                model: DetalleSalida, 
                attributes: ['id', 'cantidadSolicitada'],
                include: { 
                    model: Insumo,
                    attributes: ['id', 'nombre']
                }}, 
                {
                    model: Users,
                    attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture'],
                    as: 'residente'
                },
                {
                    model: Users,
                    attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture'],
                    as: 'owner'
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            where : {
                [Op.and]: {
                    [Op.not]: {'$detalle_salida.id$' : null },
                    ...whereSearch
                }
            },
            order: [['id', 'DESC']] 
        })
        .then( prestamos => {
            res.status(200).json({ prestamos });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error al obtener los prestamos', error: error.message });
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    } 
}

exports.updatePrestamo = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { id, action } = req.body 
    try {
        await Prestamos.findOne({ where: {id} }).then( async prestamo => {
        
            switch (action) {
                case 'approve':
                    await Prestamos.update({ status: 2 }, { where: {id} })
    
                        .then( async () => {
                            await ValeSalida.update({ statusVale: 1 }, { where: {id: prestamo.valeSalidaId} })
                        }).catch( error => res.status(500).json({ message: 'Error al actualizar el prestamo', error: error.message }))
                    .catch( error => res.status(500).json({ message: 'Error al actualizar el prestamo', error: error.message }))
                break;
                case 'cancel':
                    await Prestamos.update({ status: 3 }, { where: {id} })
                    .then( async () => {
                        await DetalleSalida.findOne( {where: { prestamoId: id }})
                        .then( async detalle => {
                            await detalle.update({ status: 4, message: 'No fue aprobado el prestamo '})
                            .catch( error => res.status(500).json({ message: 'Error al actualizar el vale', error: error.message }))

                            await ValeSalida.findOne({ where: { id: detalle.valeSalidaId }, include: [ { model: DetalleSalida, include:Insumo }] })
                            .then( async valeSalida => {
                                if(valeSalida.detalle_salidas.every( item => item.status === 4 )){
                                    valeSalida.statusVale = 5
                                    valeSalida.comentarios = 'Cancelado, no fue aprobado el prestamo'
                                    await valeSalida.save()
                                }
                            })
                        })
                        .catch( error => res.status(500).json({ message: 'No se encontro el vale relacionado', error: error.message }))
                    })
                    .catch( error => res.status(500).json({ message: 'Error al actualizar el prestamo', error: error.message }))
                break;
                case 'return':
                    await Prestamos.update({ status: 4 }, { where: {id} })
                    .catch( error => res.status(500).json({ message: 'Error al actualizar el prestamo', error: error.message }))
                break;
                case 'verify':
                    await Prestamos.update({ status: 5}, { where: {id} })
                    .catch( error => res.status(500).json({ message: 'Error al actualizar el prestamo', error: error.message }))

                default:
                    // res.status(200).json({ prestamo })
                break;
            }
            
        })

        await Prestamos.findOne({ 
            where: {id}, 
            include: [{ 
            model: DetalleSalida, 
            attributes: ['id', 'cantidadSolicitada'],
            include: { 
                model: Insumo,
                attributes: ['id', 'nombre']
            }}, 
            {
                model: Users,
                attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'],
                as: 'residente'
            },
            {
                model: Users,
                attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'],
                as: 'owner'
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            order: [['id', 'DESC']] 
        })
        .then( async prestamo => {
            res.status(200).json({ prestamo }) 
        })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}