
const Bitacora = require('../models/Bitacora')
const TipoBitacora = require('../models/TipoBitacora')
const GaleriaBitacora = require('../models/GaleriaBitacora')
const moment = require('moment')
const fs = require('fs')
const formidable = require('formidable-serverless')
const { s3Client, s3 } = require('../utils/s3Client')


const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')



exports.getBitacoras = async (req, res) => {
    try {
        const bitacoras = await Bitacora.findAll({
            include: [
                { model: TipoBitacora, attributes: ['nombre'] },
                { model: GaleriaBitacora, attributes: ['url', 'type'] }
            ]
        })
        res.status(200).json(bitacoras)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las bitacoras", error})
    }
}


exports.getBitacora = async (req, res) => {
    try {
        const bitacora = await
            Bitacora.findOne({
                where: { id: req.params.id },
                include: [
                    { model: TipoBitacora, attributes: ['nombre'] },
                    { model: GaleriaBitacora, attributes: ['url', 'type'] }
                ]
            })
        res.status(200).json(bitacora)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la bitacora" })
    }
}


exports.createBitacora = async (req, res) => {

    const form = new formidable.IncomingForm({ multiples: true })
    form.uploadDir = './static/bitacoras'
    form.keepExtensions = true

    //  Upload multiple files to S3
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "Error al subir la bitacora", err });

        let galeria = files.files

        if (!Array.isArray(galeria)) {
            galeria = [galeria]
        }

        try {

            await Bitacora.create({
                titulo: fields.titulo,
                informacionAdicional: fields.informacionAdicional,
                fecha: moment(fields.fecha),
                tipoBitacoraId: fields.tipoBitacoraId,
                obraId: fields.obraId,
                nivelId: fields.nivelId,
                zonaId: fields.zonaId,
                actividadId: fields.actividadId,
                personalId: fields.personalId,
            }).then( async (bitacora) => {
                    const galeriaSet = await uploadFiles(galeria, bitacora.id)
                    res.status(200).json({ message: "Bitacora creada con exito", bitacora })
            })    
        } catch (error) {                
            res.status(500).json({ message: "Error al crear la bitacora", error })
        }
    })
}


const uploadFiles = async (files, bitacoraId) => {

    let galeriaSet  = []

    return new Promise( async (resolve, reject) => {

        await Promise.all(files.map(async (file) => {

        const fileName = file.name
        const fileBuffered = fs.readFileSync(file.path)


        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fileBuffered,
            Key: `bitacoras/${ new Date().getTime() }-${ fileName }`,
            ACL: 'public-read',
            ContentType: file.type
        }


        await s3Client.send(new PutObjectCommand(uploadParams)).then( async (data) => {

            await GaleriaBitacora.create({
                url: uploadParams.Key,
                type: file.type,
                }).then( async (galeria) => {
                    galeriaSet.push(galeria.id)
                    await galeria.setBitacoras(bitacoraId)
                })
            }).catch( (err) => {
                console.log(err);
            })
        }))

        
        resolve(galeriaSet)
    })  
}















  // return new Promise((resolve, reject) => {
    //     Object.keys(files.files).forEach( async (key) => {
    //         const fileName = files.files[key].name
    //         const file = fs.readFileSync(files.files[key].path)
    //         const originalPath = files.files[key].path

    //         const uploadParams = {
    //             Bucket: process.env.AWS_BUCKET_NAME,
    //             Body: file,
    //             Key: `bitacoras/${Math.random()+fileName}`,
    //             ACL: 'public-read',
    //             ContentType: files.files[key].type
    //         }

    //         s3Client.send(new PutObjectCommand(uploadParams))
    //             await GaleriaBitacora.create({
    //                 url: uploadParams.Key,
    //                 type: files.files[key].type,
    //             }).then( async galeria => {            
    //                 fs.unlinkSync(originalPath)
    //                 galeriaSet.push(galeria)
    //             })
    //     })
    //     resolve(galeriaSet)
    // })