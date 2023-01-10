const Obra = require('../models/Obra');
const Nivel = require('../models/Nivel');
const { validationResult } = require('express-validator');
const Etapas = require('../models/Etapas');
const { Op } = require('sequelize');


exports.getObras = async (req, res) => {

    const { search } = req.query

    // or etapa
    const where = search ? {
        [Op.or]: [
            { nombre: { [Op.like]: `%${search}%` } },
            { clave: { [Op.like]: `%${search}%` } },
            { '$etapa.nombre$': { [Op.like]: `%${search}%` } }
        ]
    }
    : {}
    where.status = 1
    where.id = { [Op.ne]: 0 } // para que no se quede vacio
    
    try {
        // const obra = await Obra.findAll({ include: {model: Nivel, where:{ status : 1 }}, where: { status: 1 } }).catch(error => {
        const obra = await Obra.findAll({where, include: [{model: Nivel}, {model: Etapas}] }).catch(error => {
            res.status(500).json({ message: 'Error al obtener las obras', error: error.message })
        })
        if(obra){
            res.status(200).json({ obra })
        }else{
            res.status(404).json({ message: 'No hay obras' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getObra = async (req, res) => {

    const { id } = req.params;
    try {
        const obra = await Obra.findOne({ include: Nivel, where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener la obra', error: error.message })
        })
        if(obra){
            res.status(200).json({ obra })
        }else{
            res.status(404).json({ message: 'No hay obra' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createObra = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { nombre, clave, status, niveles, etapaId} = req.body;
    try {
        const obra = await Obra.create({
            nombre,
            clave,
            etapaId,
            status,
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear la obra', error: error.message })
        })
        if(obra){
            await obra.setNiveles(niveles)
            res.status(200).json({ obra })
        }else{ 
            res.status(500).json({ message: 'Error al crear la obra' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateObra = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

   const {id} = req.params;
    const { nombre, clave, status, niveles, etapaId} = req.body;
    try{
        const obra = await Obra.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la obra', error: error.message})
        })
        if(obra){
            obra.nombre = nombre ?? obra.nombre
            obra.clave = clave ?? obra.clave
            obra.status = status ?? obra.status
            obra.etapaId = etapaId ?? obra.etapaId
            await obra.save()
            
            await obra.setNiveles(niveles)

            res.status(200).json({obra})
        }else{
            res.status(500).json({message: 'Error al obtener la obra'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }

}

exports.deleteObra = async (req, res) => {
   const {id} = req.params;
    try{
        const obra = await Obra.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener la obra', error: error.message})
        })
        if(obra){
            await obra.update({status: 0})
            res.status(200).json({obra})
        }
    }
    catch(error){
        res.status(500).json({message: 'Error del servidor', error: error.message})
    }
}
