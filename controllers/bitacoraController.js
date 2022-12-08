const { Obra, Nivel, Zona, Personal, Bitacora, TipoBitacora, GaleriaBitacora, Actividad, User} = require('../models')
const moment = require('moment')
const formidable = require('formidable-serverless')
const { s3Client } = require('../utils/s3Client')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const tinify = require('tinify');
const ComentariosBitacora = require('../models/ComentarioBitacora')
const GaleriaComentario = require('../models/GaleriaComentario')


const { getPagination, getPagingData } = require('../utils/paginacion')
const { Op } = require('sequelize')
tinify.key = process.env.TINY_IMG_API_KEY;

exports.getBitacoras = async (req, res) => {


    const { obraId, nivelId, zonaId, actividadId, personalId, tipoBitacoraId, fechaInicio, fechaFin, page, size, busqueda = "", ordenSolicitado = "DESC" } = req.query

    console.log(obraId);

    const { limit, offset } = getPagination(page, size);


    const obraWhere = [
        obraId ? {"$obra.id$" : obraId } : {},
        busqueda ? {"$obra.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]
    
    const nivelWhere = [
        nivelId ? {"$nivele.id$" : nivelId } : {},
        busqueda ? {"$nivele.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const zonaWhere = [
        zonaId ? {"$zona.id$" : zonaId } : {},
        busqueda ? {"$zona.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const actividadWhere = [
        actividadId ? {"$actividade.id$" : actividadId } : {},
        busqueda ? {"$actividade.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const personalWhere = [
        personalId ? {"$personal.id$" : personalId } : {},
        busqueda ? {"$personal.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    // const tipoBitacoraWhere = [
    //     tipoBitacoraId ? {"$tipo_bitacora.id$" : tipoBitacoraId } : {},
    //     busqueda ? {"$tipo_bitacora.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    // ]

    const fechaWhere = [
        fechaInicio ? {"fecha" : {[Op.gte]: moment(fechaInicio).startOf('day').format('YYYY-MM-DD HH:mm:ss')}} : {},     
        fechaFin ? {"fecha" : {[Op.lte]: moment(fechaFin).endOf('day').format('YYYY-MM-DD HH:mm:ss')}} : {}
    ]
    
    console.log(fechaWhere)

    try {
        const bitacoras = await Bitacora.findAndCountAll({
            include: [
                { model: TipoBitacora, attributes: ['nombre'] },
                { model: GaleriaBitacora, attributes: ['url', 'type'] },
                { model: Obra, attributes: ['id', 'nombre', 'centroCosto'], where: obraWhere },
                { model: Nivel, attributes: ['id', 'nombre'], where: nivelWhere},
                { model: Zona, attributes: ['nombre'], where: zonaWhere},
                { model: Actividad, attributes: ['nombre'], where: actividadWhere},
                { model: Personal, attributes: ['nombre'], where: personalWhere},
                { model: User, attributes: ['nombre'] },
            ],
            order: [
                ['id', ordenSolicitado]
            ],
            limit,
            distinct: true,
            offset,
            where: {[Op.and] : [fechaWhere]},
            logging: console.log

        })

        const response = getPagingData(bitacoras, page, limit);
        res.status(200).json({bitacoras:response})
    } catch (error) {
        console.log(error);
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
                    { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno' ] },
                    { model: ComentariosBitacora, attributes: ['id', 'comentario', 'bitacoraId', 'autorId', 'createdAt'], include: [
                        { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture' ] },
                        { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }
                    ] }
                ]
            })
        res.status(200).json({bitacora})
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la bitacora", error})
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


    const form = new formidable.IncomingForm({ multiples: true })
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "Error al subir la bitacora", err });

        const { comentario, id } = fields

        const galeria = Object.values(files)

        try {
            await ComentariosBitacora.create({
                    bitacoraId: id,
                    comentario: comentario,
                    autorId: req.user.id
            }).then( async (comentario) => {
                
                
                await uploadDynamicFiles(galeria, 'comentarios').then( async (result) => {
                    await GaleriaComentario.bulkCreate(result.map( item => {
                        return { url:item.url, comentarioId: comentario.id, type: item.type }
                    }))

                    result = await ComentariosBitacora.findOne({
                        where: { id: comentario.id },
                        include: [
                            { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture' ] },
                            { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }
                        ]
                    })

                    res.status(200).json({ message: "Comentario creado con exito", comentario:result })
                    
                })
            })
            
        } catch (error) {
            res.status(500).json({ message: "Error al crear el comentario", error })
        }
    })
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

const uploadDynamicFiles = async (files, folderName) => {


    let galeriaSet  = []

    return new Promise( async (resolve, reject) => {
            
            await Promise.all(files.map(async (picture) => {
                
            const contentType = picture.type
            let file = picture.path
            let folder = `${folderName}/files`


            if ( contentType === 'image/jpeg' || contentType === 'image/png' || contentType === 'image/jpg' ) {
                let source = tinify.fromFile(picture.path);
                file = await source.toBuffer();
                folder = `${folderName}/images`
            }

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: file,
                Key: `${folder}/file-${ new Date().getTime() }`,
                ACL: 'public-read',
                ContentType: contentType
            }

            const data = await s3Client.send(new PutObjectCommand(uploadParams))
            if(data) {
                galeriaSet.push({url: uploadParams.Key, type: contentType})
            }else{
                reject('error')
            }

        }))

        resolve(galeriaSet);
    })
}


//  Tipo de bitacora

exports.getTipoBitacoras = async (req, res) => {
    try {
        const tiposBitacora = await TipoBitacora.findAll()
        res.status(200).json({ message: "Tipo de bitacoras", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tipos de bitacoras", error })
    }
}

exports.createTipoBitacora = async (req, res) => {
    try {
        const { nombre } = req.body
        const tiposBitacora = await TipoBitacora.create({ nombre })
        res.status(200).json({ message: "Tipo de bitacora creado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al crear el tipo de bitacora", error })
    }
}

exports.updateTipoBitacora = async (req, res) => {
    try {
        const { id, nombre } = req.body
        const tiposBitacora = await TipoBitacora.update({ nombre }, { where: { id } })
        res.status(200).json({ message: "Tipo de bitacora actualizado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el tipo de bitacora", error })
    }
}

exports.deleteTipoBitacora = async (req, res) => {
    try {
        const { id } = req.body
        const tiposBitacora = await TipoBitacora.destroy({ where: { id } })
        res.status(200).json({ message: "Tipo de bitacora eliminado", tiposBitacora })
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el tipo de bitacora", error })
    }
}