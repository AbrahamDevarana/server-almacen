const { Obra, Nivel, Zona, Personal, Bitacora, TipoBitacora, GaleriaBitacora, Actividad, User} = require('../models')
const moment = require('moment')
const formidable = require('formidable-serverless')
const { s3Client } = require('../utils/s3Client')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const tinify = require('tinify');
tinify.key = process.env.TINY_IMG_API_KEY;

exports.getBitacoras = async (req, res) => {
    try {
        const bitacoras = await Bitacora.findAll({
            include: [
                { model: TipoBitacora, attributes: ['nombre'] },
                { model: GaleriaBitacora, attributes: ['url', 'type'] },
                { model: Obra, attributes: ['nombre'] },
                { model: Nivel, attributes: ['nombre'] },
                { model: Zona, attributes: ['nombre'] },
                { model: Actividad, attributes: ['nombre'] },
                { model: Personal, attributes: ['nombre'] },
                { model: User, attributes: ['nombre'] }
            ]
        })
        res.status(200).json({bitacoras})
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
                    { model: TipoBitacora, attributes: ['id', 'nombre'] },
                    { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                    { model: Obra, attributes: ['id', 'nombre'] },
                    { model: Nivel, attributes: ['id', 'nombre'] },
                    { model: Zona, attributes: ['id', 'nombre'] },
                    { model: Actividad, attributes: ['id', 'nombre'] },
                    { model: Personal, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'] },
                    { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno' ] }
                ]
            })
        res.status(200).json({bitacora})
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la bitacora" })
    }
}

exports.createBitacora = async (req, res) => {

    const form = new formidable.IncomingForm({ multiples: true })
    // form.uploadDir = './static/bitacoras'
    form.keepExtensions = true
   
    form.parse(req, async (err, fields, files) => {


        //  obtener todos los participantesId del objeto fields
        const participantesId = Object.keys(fields).filter( (key) => key.includes('participantesId') )
        const participantes = participantesId.map( (key) => fields[key] )
       
        if (err) return res.status(500).json({ message: "Error al subir la bitacora", err });

        const galeria = Object.values(files)

        try {

            await Bitacora.create({
                titulo: fields.titulo,
                informacionAdicional: fields.informacionAdicional,
                fecha: moment(new Date(fields.fecha)).format('YYYY-MM-DD HH:mm:ss'),
                tipoBitacoraId: fields.tipoBitacoraId,
                obraId: fields.obraId,
                nivelId: fields.nivelId,
                zonaId: fields.zonaId,
                actividadId: fields.actividadId,
                personalId: fields.personalId,
                autorId: req.user.id
            }).then( async (bitacora) => {
                await uploadFiles(galeria, bitacora.id)

                await bitacora.setUsers(participantes)

                res.status(200).json({ message: "Bitacora creada con exito", bitacora })
            })    
        } catch (error) {                
            res.status(500).json({ message: "Error al crear la bitacora", error })
            // 
        }
    })
}


exports.createComentario = async (req, res) => {

    try {
        await ComentarioBitacora.create({
            bitacoraId: req.body.id,
            comentario: req.body.comentario,
            autorId: req.user.id
        })
        res.status(200).json({ message: "Comentario creado con exito" })
    } catch (error) {
        res.status(500).json({ message: "Error al crear el comentario", error })
    }
}

const uploadFiles = async (files, bitacoraId) => {

    let galeriaSet  = []

    return new Promise( async (resolve, reject) => {

        await Promise.all(files.map(async (picture) => {
            
        const contentType = picture.type
        let folderName = 'bitacoras/files'
        let file = picture.path


        if( contentType === 'image/jpeg' || contentType === 'image/png' || contentType === 'image/jpg' ) {
            let source = tinify.fromFile(picture.path);
            file = await source.toBuffer();
            folderName = 'bitacoras/images'
        }


        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: file,
            Key: `${folderName}/bitacora-${ new Date().getTime() }`,
            ACL: 'public-read',
            ContentType: contentType
        }


        await s3Client.send(new PutObjectCommand(uploadParams)).then( async (data) => {

            await GaleriaBitacora.create({
                url: uploadParams.Key,
                type: contentType,
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


const uploadDynamicFiles = async (files, bitacoraId) => {

}