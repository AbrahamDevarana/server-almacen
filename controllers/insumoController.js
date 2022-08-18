const Insumo = require('../models/Insumos')
const multer = require('multer')
const fs = require('fs');
const csv = require('fast-csv');
const { validationResult } = require('express-validator')

exports.getInsumos = async (req, res) => {
    try {
        const insumos = await Insumo.findAll().catch(error => {
            res.status(500).json({ message: 'Error al obtener los insumos', error: error.message })
        })
        if(insumos){
            res.status(200).json({ insumos })
        }else{
            res.status(404).json({ message: 'No hay insumos' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.getInsumo = async (req, res) => {
    const { id } = req.params
    try {
        const insumo = await Insumo.findOne({ where: { id } }).catch(error => {
            res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
        })
        if(insumo){
            res.status(200).json({ insumo })
        }else{
            res.status(404).json({ message: 'No hay insumo' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.createInsumo = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const { claveEnk, centroCosto, nombre, unidadMedida, status } = req.body
    try {
        const insumo = await Insumo.create({
            nombre,
            claveEnk,
            centroCosto,
            unidadMedida,
            status,
        }).catch(error => {
            res.status(500).json({ message: 'Error al crear el insumo', error: error.message })
        })
        if(insumo){
            res.status(200).json({ insumo })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.updateInsumo = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios', errors: errors.map() });
    }

    const {id} = req.params
    const {claveEnk, centroCosto, nombre, unidadMedida, status} = req.body
    try{
        const insumo = await Insumo.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el insumo', error: error.message})
        })
        if(insumo){
            insumo.nombre = nombre ?? insumo.nombre
            insumo.claveEnk = claveEnk ?? insumo.claveEnk
            insumo.centroCosto = centroCosto ?? insumo.centroCosto
            insumo.unidadMedida = unidadMedida ?? insumo.unidadMedida
            insumo.status = status ?? insumo.status
            await insumo.save()
            res.status(200).json({insumo})
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.deleteInsumo = async (req, res) => {
    const {id} = req.params
    try{
        const insumo = await Insumo.findOne({where: {id}}).catch(error => {
            res.status(500).json({message: 'Error al obtener el insumo', error: error.message})
        })
        if(insumo){
            insumo.status = !insumo.status
            await insumo.save()
            res.status(200).json({insumo})
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message })
    }
}

exports.massiveUpload = async (req, res) => {
    

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './storage/insumos')
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
      })
      
    const upload = multer({ storage: storage })

    upload.array('insumos', 10)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error al subir el archivo', error: err.message })
        } else if (err) {
            return res.status(500).json({ message: 'Error al subir el archivo', error: err.message })
        }
       try {
            if(uploadCsvDataToMySQL(req.files[0], res)){
                res.status(200).json({ message: 'Insumos cargados correctamente' })
            }
       } catch (error) {
              res.status(500).json({ message: 'Error del servidor', error: error.message })
       }
    })
}

function uploadCsvDataToMySQL (data, res) {
    let stream = fs.createReadStream(data.path)
    let csvData = []
    let csvStream = csv
    
        .parse({ headers: true })
        .on("data", function (data) {
            csvData.push(data)
        })
        .on("end", async function () {
            let insumos = csvData.map(insumo => {
                return {
                    nombre: insumo.nombre,
                    claveEnk: insumo.claveEnk,
                    centroCosto: insumo.centroCosto,
                    unidadMedida: insumo.unidadMedida,
                    status: insumo.status,
                }
            })
            // si existe un insumo con la misma claveEnk y el mismo centroCosto, no se crea 
            
            let insumosNoCreados = []
            let insumosExistentes = []
            for (let i = 0; i < insumos.length; i++) {
                const insumo = await Insumo.findOne({ where: { claveEnk: insumos[i].claveEnk, centroCosto: insumos[i].centroCosto} }).catch(error => {
                    res.status(500).json({ message: 'Error al obtener el insumo', error: error.message })
                })
                if(insumo){
                    insumosExistentes.push(insumo)
                }
                else{
                    insumosNoCreados.push(insumos[i])
                }
            }
            if(insumosNoCreados.length > 0){
                await Insumo.bulkCreate(insumosNoCreados).catch(error => {
                    res.status(500).json({ message: 'Error al crear los insumos', error: error.message })
                })
            }
            res.status(200).json({ message: 'Insumos cargados correctamente', insumosExistentes, insumosNoCreados })
            // remove file
            fs.unlink(data.path, (err) => {
                if (err) throw err
            })


            
        })
        .on('error', function (err) {
            fs.unlink(data.path, (err) => {
                if (err) throw err
            })
            res.status(500).json({ message: 'El formato del archivo es incorrecto', error: err.message })
        })
        

    stream.pipe(csvStream)
}