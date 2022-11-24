
const Bitacora = require('../models/Bitacora')
const TipoBitacora = require('../models/TipoBitacora')
const GaleriaBitacora = require('../models/GaleriaBitacora')
const jwt = require('../services/jwtStrategy')
const moment = require('moment')
const fs = require('fs')

const formidable = require('formidable-serverless')

const aws = require('aws-sdk')

const multer = require('multer');
const multerS3 = require('multer-s3');


const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
})


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
    
    // Log form-data        
    form.uploadDir = './static/bitacoras'
    form.keepExtensions = true

    let galeriaId = []

    //  Upload multiple files to S3
    await form.parse(req, async (err, fields, files) => {
        
        if (err) return res.status(500).json({ message: "Error al subir la bitacora", err });

        try {
                Object.keys(files.files).forEach((key) => {
                    
                    const fileName = files.files[key].name
                    const file = fs.readFileSync(files.files[key].path)
                    const originalPath = files.files[key].path
                    // Upload file to S3

                    const uploadParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Body: file,
                        Key: `bitacoras/${fileName}`,
                        ACL: 'public-read'
                    }

                    s3.upload(uploadParams, {
                        partSize: 10 * 1024 * 1024,
                        queueSize: 10,
                    }).send( async (err, data) => {
                        if (err) {
                            fs.unlinkSync(originalPath)
                            return res.status(500).json({ message: "Error al subir el archivo", err })
                        }else{
                            fs.unlinkSync(originalPath)
                        
                            await GaleriaBitacora.create({
                                url: data.Location,
                                type: files.files[key].type,
                            }).then((galeria) => {
                                galeriaId.push(galeria.id)
                            }).catch((err) => {
                                res.status(500).json({ message: "Error al subir el archivo", err })
                            })
                        }
                    })
                })

                //  Create bitacora and associate with files
                const bitacora = await Bitacora.create({
                    titulo: fields.titulo,
                    descripcion: fields.descripcion,
                    fecha: moment(fields.fecha).format('YYYY-MM-DD'),
                    tipoBitacoraId: fields.tipoBitacoraId,
                    obraId: fields.obraId,
                    nivelId: fields.nivelId,
                    zonaId: fields.zonaId,
                    actividadId: fields.actividadId,
                    personalId: fields.personalId,
                })

                

       

               
                if( bitacora ){
                    console.log(galeriaId);
                    if(galeriaId.length > 0){
                        await bitacora.setGaleriaBitacora(galeriaId)
                    }
                    res.status(200).json({ message: "Bitacora creada correctamente", bitacora })
                }else {
                    return res.status(500).json({ message: "Error al crear la bitacora" })
                }
                
        } catch (error) {                
            res.status(500).json({ message: "Error al crear la bitacora", error })
        }
    })

    

}