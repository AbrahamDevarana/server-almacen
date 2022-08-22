const Prestamo = require('../models/Prestamos');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { DetalleSalida } = require('../models');
const Insumo = require('../models/Insumos');
const Users = require('../models/Users');

exports.getAllPrestamos = async (req, res) => {

    const { id } = req.user;
    try {
         
        await Prestamo.findAll({ 
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
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            

            
            where : {[Op.or]: [{ 'belongsTo': id }, { 'deliverTo': id }],
            

                
        }})
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


exports.createPrestamo = async (req, res) => {
    try{
        
    } catch (error) {
        res.status(500).json({ message: "Error del servidor", error: error.message })
    }
}