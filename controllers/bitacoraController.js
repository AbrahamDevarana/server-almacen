const { Obra, Nivel, Zona, Personal, Bitacora, TipoBitacora, GaleriaBitacora, Actividad, User, Role} = require('../models')
const moment = require('moment')
const formidable = require('formidable-serverless')
const { s3Client } = require('../utils/s3Client')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const tinify = require('tinify');
const ComentariosBitacora = require('../models/ComentarioBitacora')
const GaleriaComentario = require('../models/GaleriaComentario')
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const { getPagination, getPagingData } = require('../utils/paginacion')
const { Op, Sequelize } = require('sequelize')
const { reporteBitacora } = require('../email/Notificaciones')
const Etapas = require('../models/Etapas')
const PivotBitacoraUser = require('../models/PivotBitacoraUser')
const Users = require('../models/Users')
const Permisos = require('../models/Permisos')
tinify.key = process.env.TINY_IMG_API_KEY;
// moment locale mx
moment.locale('es-mx')

exports.getBitacoras = async (req, res) => {
    const { userId, obraId, nivelId, zonaId, actividad, fechaInicio, fechaFin, etapaId, page, size, busqueda = "", ordenSolicitado = "DESC" } = req.query
    const { limit, offset } = getPagination(page, size);
    const { id } = req.user


    const obraWhere = [
        obraId ? {"$obra.id$" : obraId } : {}
        // busqueda ? {"$obra.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]
    
    const nivelWhere = [
        nivelId ? {"$nivele.id$" : nivelId } : {},
    ]

    const zonaWhere = [
        zonaId ? {"$zona.id$" : zonaId } : {},
    ]

    const userWhere = [
        userId ? {"$user.id$" : userId } : {},
    ]

    const etapaWhere = [
        etapaId ? {"$etapa.id$" : etapaId } : {},
    ]


    const busquedaWhere = busqueda ?
        {
            [Op.or]: [
                {"$tipo_bitacora.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$obra.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$nivele.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$zona.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$autorExt.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$autorInt.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$autorExt.apellidoPaterno$" : {[Op.like]: `%${busqueda}%`}},
                {"$autorInt.apellidoPaterno$" : {[Op.like]: `%${busqueda}%`}},
                {"actividad" : {[Op.like]: `%${busqueda}%`}},
            ]
        } : {}



    const fechaWhere = [
        fechaInicio ? {"fecha" : {[Op.gte]: moment(fechaInicio).startOf('day').format('YYYY-MM-DD HH:mm:ss')}} : {},     
        fechaFin ? {"fecha" : {[Op.lte]: moment(fechaFin).endOf('day').format('YYYY-MM-DD HH:mm:ss')}} : {}
    ]
   
    

    try {

        const user = await Users.findOne({ where: { id }, include: [{ model: Role, include: Permisos}] })
        let whereAutor = {}

        if (user.role.permisos.some( item => item.permisos === 'crear bitacora' ))  {

            if( user.role.permisos.some( item => item.permisos === 'ver bitacora de otros' ) ) {

                whereAutor = {}

            }else{
                whereAutor = {
                    [Op.or]: [
                        { autorId: id },
                        {
                            '$participantes.pivot_bitacora_users.userId$': id,
                        },
                        {
                            externoId: id,
                        }
                    ]
                }
            }

            const bitacoras = await Bitacora.findAndCountAll({
                include: [
                    { model: TipoBitacora, attributes: ['nombre'] },
                    { model: GaleriaBitacora, attributes: ['url', 'type'] },
                    { model: Obra, attributes: ['id', 'nombre', 'centroCosto'], where: obraWhere , required: false},
                    { model: Nivel, attributes: ['id', 'nombre'], where: nivelWhere, required: false},
                    { model: Zona, attributes: ['nombre'], where: zonaWhere, required: false},
                    { model: Etapas, attributes: ['nombre'], where: etapaWhere},
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorInt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), true),
                    }, 
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorExt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), false),
                    }, 
                    { model: User, attributes: ['id'], as: 'participantes' },
                ],
                order: [
                    ['id', ordenSolicitado]
                ],
                // limit,
                // offset,
                distinct: true,
                where: {[Op.and] : [fechaWhere, busquedaWhere, whereAutor]}

            })
            const response = getPagingData(bitacoras, page, limit);
            res.status(200).json({bitacoras:response})
        }else {
            res.status(200).json({bitacoras:[]})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener las bitacoras", error})
    }
}

exports.getBitacora = async (req, res) => {

    try {
        await Bitacora.findOne({
                where: { uid: req.params.uid },
                include: [
                    { model: TipoBitacora, attributes: ['id', 'nombre'] },
                    { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                    //  where id != 0
                    { model: Obra, attributes: ['id', 'nombre']},
                    { model: Nivel, attributes: ['id', 'nombre']},
                    { model: Zona, attributes: ['id', 'nombre']},
                    { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno' ], as: 'participantes' },
                    { model: ComentariosBitacora, attributes: ['id', 'comentario', 'bitacoraId', 'autorId', 'createdAt'], include: [
                        { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture' ]},
                        { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }
                    ] },
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorInt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), true),
                    }, 
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorExt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), false),
                    }, 
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'contratista',
                        required: false,
                    }
                ]
            }).then( bitacora => {
                if(!bitacora) {
                    res.status(404).json({ message: "No se encontró la bitácora" })
                } else {
                    res.status(200).json({ bitacora })
                }
            }).catch( error => {
                console.log(error);
                res.status(500).json({ message: "Error al obtener bitácora", error})
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener la bitácora", error})
    }
}

exports.createBitacora = async (req, res) => {

    const form = new formidable.IncomingForm({ multiples: true })
    // form.uploadDir = './static/bitacoras'
    form.keepExtensions = true
   
    form.parse(req, async (err, fields, files) => {


        //  obtener todos los participantesId del objeto fields
        const participantesId = Object.keys(fields).filter( (key) => key.includes('participantesId') )
        const participantes = participantesId.map( (key) => Number(fields[key]) )
       
        if (err) return res.status(500).json({ message: "Error al subir la bitacora", err });

        const galeria = Object.values(files)
        try {

            const tipoBitacora = await TipoBitacora.findOne({ where: { id: fields.tipoBitacoraId } })

            await Bitacora.create({
                titulo: fields.titulo,
                descripcion: fields.descripcion,
                
                etapaId: fields.etapaId,
                obraId: fields.obraId,
                nivelId: fields.nivelId,
                zonaId: fields.zonaId,
                externoId: fields.externoId,
                tipoBitacoraId: fields.tipoBitacoraId,
                autorId: req.user.id,
                externoId: fields.externoId,

                actividad: fields.actividad,
                esInterno: fields.esInterno,                
                fecha: moment(new Date(fields.fecha)).format('YYYY-MM-DD HH:mm:ss'),

            }).then( async (bitacora) => {

                await bitacora.setParticipantes(participantes).catch( (error) => {
                    console.log(error);
                    res.status(500).json({ message: "Error al vincular a los participantes", error })
                })

                    
                if( participantes.length > 0 ){
                    await User.findAll({
                        where: { 
                            [Op.or]: [
                                { id: participantes },
                                { id : bitacora.externoId }
                            ]
                        }
                    }).then( async (users) => {                            
                        await reporteBitacora(req.user, tipoBitacora.dataValues.nombre, users, bitacora.dataValues.uid)
                    }).catch( (error) => {
                        console.log(error);
                        res.status(500).json({ message: "Error al enviar reporte bitacora", error })
                    })
                }

                await uploadDynamicFiles(galeria, 'bitacoras').then( async (result) => {
                    await result.forEach( async (item) => {
                        await GaleriaBitacora.create({
                            url: item.url,
                            type: item.type
                        }).then( async (galeria) => {
                            await galeria.setBitacoras(bitacora.id)
                        }).catch( (error) => {
                            console.log(error);
                            res.status(500).json({ message: "Error syncronizar bitacora", error })
                        })
                    })     
                   
                    
                    res.status(200).json({ message: "Bitacora creada correctamente", bitacora })   

                }).catch( (error) => {
                    console.log(error);
                    res.status(500).json({ message: "Hubo un problema al subir los archivos, pero la bitácora se ha generado correctamente, Contacta a soporte", error })
                })

                
            })    
        } catch (error) {  
            console.log(error);              
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
                
                
                await uploadDynamicFiles(galeria, 'bitacoras/comentarios').then( async (result) => {
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

// Generar reporte de bitacoras
exports.generateReport = async (req, res) => {
    const { titulo, descripcion, comentarios, imagenes, selectedOption = [] } = req.body
    try {

        await Bitacora.findAll({
            where: { uid: selectedOption },
            include: [
                { model: TipoBitacora, attributes: ['id', 'nombre'] },
                    { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                    //  where id != 0
                    { model: Obra, attributes: ['id', 'nombre']},
                    { model: Nivel, attributes: ['id', 'nombre']},
                    { model: Zona, attributes: ['id', 'nombre']},
                    { model: Etapas, attributes: ['id', 'nombre']},                    
                    { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'esInterno' ], as: 'participantes' },
                    { model: ComentariosBitacora, attributes: ['id', 'comentario', 'bitacoraId', 'autorId', 'createdAt'], include: [
                        { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture' ]},
                        { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }
                    ] },
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorInt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), true),
                    }, 
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorExt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), false),
                    },
                    {
                        model: User,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'contratista',
                        required: false,
                    }
                

                
            ]
        }).then( async (bitacoras) => {
            await generatePdf(res, bitacoras,  titulo, descripcion, comentarios, imagenes)
        })
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al generar el reporte", error })        
    }



}

exports.updateBitacoraView = async (req, res) => {
    const { uid } = req.params
    const { id } = req.user

    try {
        await Bitacora.findOne({
            where: { uid },
            include: [
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'], as: 'participantes' }
            ]
        }).then( async (bitacora) => {
            const participantes = bitacora.participantes.map( item => item.id )
            if ( participantes.includes(id) ) {
                await PivotBitacoraUser.update({ visited: true }, { where: { bitacoraId: bitacora.id, userId: id } })
            }
        })
        res.status(200).json({ message: "Bitacora actualizada correctamente" , id})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al actualizar la bitacora", error })
    }    
}

exports.updateBitacoraConfirm = async (req, res) => {
    const { uid } = req.params
    const { id } = req.user

    try {
        await Bitacora.findOne({
            where: { uid },
            include: [
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'], as: 'participantes' }
            ]
        }).then( async (bitacora) => {
            const participantes = bitacora.participantes.map( item => item.id )
            if ( participantes.includes(id) ) {
                await PivotBitacoraUser.update({ confirmed: true }, { where: { bitacoraId: bitacora.id, userId: id } })
            }
        })
        res.status(200).json({ message: "Bitacora confirmada correctamente" , id})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al actualizar la bitacora", error })
    }
}




// Funciones
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

        })).catch( (err) => {
            console.log(err);
            reject(err)
        })


        resolve(galeriaSet);
    })
}

const generatePdf = async (response, bitacoras, titulo, descripcion, comentarios, imagenes) => {


    const logo = fs.readFileSync(path.resolve(__dirname, '../static/img/logo.png'))
    const logoBase64 = logo.toString('base64')
    // print first bitacoras
    const content = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;700&family=Playfair+Display&display=swap" rel="stylesheet">
            <link href="${'../static/fonts/Mulish-Regular.ttf'}" rel="stylesheet">
            <link href="${'../static/fonts/PlayfairDisplay-Regular.ttf'}" rel="stylesheet">
            <style>
                @font-face {
                    font-family: 'Mulish';
                    src: url('/static/Mulis-Regular.ttf');
                }
                @font-face {
                    font-family: 'Playfair Display';
                    src: url('/static/PlayfairDisplay-Regular.ttf');
                }

                p, li, span {
                    color: #646375;
                    // font-family: 'Mulish', sans-serif;
                    
                }
                h1, h2, h3, h4, h5, h6 {
                    // font-family: 'Playfair Display', serif;
                    color: #56739B;
                }
            </style>
        </head>
            
        <body>
            <table style="width: 100%; font-size: 8px; border-bottom: 1px solid rgba(100, 99, 117, .3);";>
                <tr>
                    <td style="width:10%">
                        <img src="data:image/png;base64,${logoBase64}" style="width: 50px; height: 50px; padding:0 25%" />
                    </td>
                    <td style="width: 80%;">
                        <h1 style="font-size: 24px;color:#56739B;text-align: center;">
                            ${titulo}
                        </h1>
                    </td>
                    <td style="width: 10%;">
                    </td>
                </tr>
            </table>
            
            <div style="padding: 0 0 10px; ">
                <p style="font-size: 14px;">
                    ${descripcion}
                </p>
            </div>

            ${
                bitacoras.map( (values) => {
                
                const bitacora = values.dataValues
                
                return (` 
                
                <div style="padding: 0 0 25px; ">

                <table style="background-color: #56739B; width: 100%;">
                    <td>
                        <p style="color: white; font-size: 16spx; font-weight: 600; padding: 0px 10px;"> Tipo: ${bitacora.tipo_bitacora.dataValues.nombre} </p>
                    </td>
                    <td>
                        <p style="color: white; font-size: 16spx; font-weight: 600; padding: 0px 10px;"> ${bitacora.titulo} </p>
                    </td>
                    <td>
                        <p style="color: white; font-size: 16spx; font-weight: 600; margin-left: auto; padding: 0 20px; text-align:right;">Folio: RV-${bitacora.id}</p>                
                    </td>
                </table>
                <div style="padding: 0px 10px;">
                    <table style="width: 100%;">
                        <td>
                            <p style="font-size: 12px;"><span style="font-weight: 700;">Autor:</span>  
                                ${
                                    bitacora.autorInt? bitacora.autorInt.dataValues.nombre + ' ' + bitacora.autorInt.dataValues.apellidoPaterno : bitacora.autorExt.dataValues.nombre + ' ' + bitacora.autorExt.dataValues.apellidoPaterno
                                }
                            </p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 12px;font-weight: 700;text-align: right;">
                                Fecha:  
                                <span style="font-weight: 400;">
                                    ${ moment(bitacora.fecha).format('LLL') }
                                </span>
                            </p>
                        </td>
                    </table>
   
                    <h2 style="font-size: 18px;color:#56739B;">Descripción</h2>
                    <p style="font-size: 12px;">
                        ${bitacora.descripcion}
                    </p>
    
                    <table style="width: 100%;">
                            <tr> <h2 style="font-size: 16px; color: #56739B;">Información Especifica</h2> </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Etapa:</span> ${ bitacora.etapa?.dataValues?.nombre || '' } </p>  </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Obra:</span> ${ bitacora.obra?.dataValues?.nombre || '' } </p>   </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Nivel:</span> ${ bitacora.nivele?.dataValues?.nombre || '' } </p>   </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Zona:</span> ${ bitacora.zona?.dataValues?.nombre || '' } </p>   </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Actividad:</span> ${ bitacora.actividad || '' } </p>   </tr>
                            <tr> <p style="font-size: 12px;"><span style="font-weight: 700;">Contratista:</span> ${ bitacora.contratista?.dataValues?.nombre || '' } </p>   </tr> 
                            
                    </table>
                    <div style="width: 100%;">
                    ${
                        bitacora.participantes.length > 0 ?
                        ` <h2 style="font-size: 16px; color: #56739B;">Participantes</h2>
                            ${
                                bitacora.participantes.map( (participante) => {
                                    return `<p style="font-size: 12px; width:23%; display:inline-block; margin: 0px 2px "> - 
                                    ${ participante.dataValues.nombre } 
                                    ${ participante.dataValues.apellidoPaterno }
                                    ${ participante.dataValues.esInterno ? '' : ' (Externo)' }

                                    </p>`
                                }).join('')
                            }
                        </div> `
                    : ''}
                    
                    ${
                        imagenes ? `
                            <h2 style="font-size: 16px; color: #56739B;">Evidencia</h2>
                            <div style="width:100%">
                                ${
                                    bitacora.galeria_bitacoras.map( (imagen) => {
                                        return `<a href="https://devarana-storage.sfo3.cdn.digitaloceanspaces.com/${ imagen.dataValues.url }" target="_blank">
                                                    <img src="https://devarana-storage.sfo3.cdn.digitaloceanspaces.com/${ imagen.dataValues.url }" style="width:100px; height: 100px; padding: 10px 10px;" />
                                                </a>`
                                    }).join('')
                                }
                            </div>
                        `: ''
                    }
                </div>
                
            
                
    
                ${ comentarios && bitacora.comentarios_bitacoras.length > 0 ? `
                    <hr style="border-color: rgba(86, 115, 155, .3); margin: 40px 0; border-bottom: 0;">
                    <div style="padding-bottom: 10px;">
                        <div style="margin-left: 20px; padding-left: 15px; border-left: 1px solid rgba(100, 99, 117, .3);">
                            <h2 style="font-size: 18px;color: #56739B;">Comentarios ( ${ bitacora.comentarios_bitacoras.length } )</h2>
                            ${
                                bitacora.comentarios_bitacoras.map( (comentario) => {
                                    return `<div>
                                                <p style="font-size: 12px;font-weight: 700;">
                                                    Autor:
                                                    <span style="font-weight: 400;">
                                                        ${  comentario.user.nombre + ' ' + comentario.user.apellidoPaterno }
                                                    </span>
                                                </p>
                                                <p style="font-size: 12px;">
                                                    ${ comentario.dataValues.comentario }
                                                </p>
    
                                                <p style="font-size: 12px;font-weight: 700;">
                                                    Fecha:  
                                                    <span style="font-weight: 400;">
                                                        ${ moment(comentario.dataValues.fecha).format('LLL') }
                                                    </span>
                                                </p>
                                            </div>
                                           ${
                                                imagenes ? 
                                                ` <div style="display:flex; flex-direction:row; width:100%;">
                                                    ${
                                                        comentario.galeria_comentarios.map( (imagen) => {
                                                            return `<a href="https://devarana-storage.sfo3.cdn.digitaloceanspaces.com/${ imagen.dataValues.url }" target="_blank">
                                                                        <img src="https://devarana-storage.sfo3.cdn.digitaloceanspaces.com/${ imagen.dataValues.url }" style="width:100px; height: 100px; padding:0 25px" />
                                                                    </a>`
                                                        }).join('')
                                                    }
                                                </div>` : ''
                                           }
                                            <hr style="border-color: rgba(86, 115, 155, .3); margin: 20px 0; border-bottom: 0;">`
                                }).join('')
                            }
                        </div>
                    </div>
                    <hr style="border-color: rgba(86, 115, 155, .3); margin: 10px 0; border-bottom: 0;">
                    `
                : '' }
                <!-- Loop reporte --> 
                </div>
                `) }
                ). join('') }
            
        </body>
        </html>
    `  
        pdf.create(
            content,
            {
                format: 'A4',
                orientation: 'portrait',
                border: {
                    right: '0.2in',
                    left: '0.2in',
                    top: '0.5in',
                    bottom: '0.2in'
                },
                footer: {
                    height: '0.3in',
                    contents: {
                        default: `
                            <div style="text-align:right;color: rgba(86, 115, 155, .8);">
                                <span>
                                    {{page}}
                                </span>
                                    de
                                <span>
                                    {{pages}}
                                </span>
                            </div>
                        `, // fallback value                        
                    }
                }, 
            }
        ).toFile(`./public/pdf/Reporte-${moment().format('DD-MM-YYYY-hh-mm')}.pdf`, (err, res) => {
            if (err) return console.log(err);

            fs.readFile(res.filename, (err, data) => {
                if (err) throw err;
                response.contentType("application/pdf");
                response.setHeader('Content-Disposition', `attachment; filename=Reporte-${moment().format('DD-MM-YYYY-hh-mm')}.pdf`);
                response.send(data);
                fs.unlinkSync(res.filename, (err) => {  if (err) throw err });
            })                
        })

}




        