const { Obra, Nivel, Zona, Personal, Bitacora, TipoBitacora, GaleriaBitacora, Actividad, User} = require('../models')
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
tinify.key = process.env.TINY_IMG_API_KEY;
// moment locale mx
moment.locale('es-mx')

exports.getBitacoras = async (req, res) => {
    const { userId, obraId, nivelId, zonaId, actividad, fechaInicio, fechaFin, etapaId, page, size, busqueda = "", ordenSolicitado = "DESC" } = req.query
    const { limit, offset } = getPagination(page, size);
    const obraWhere = [
        obraId ? {"$obra.id$" : obraId } : {},
        // busqueda ? {"$obra.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]
    
    const nivelWhere = [
        nivelId ? {"$nivele.id$" : nivelId } : {},
        // busqueda ? {"$nivele.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const zonaWhere = [
        zonaId ? {"$zona.id$" : zonaId } : {},
        // busqueda ? {"$zona.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const userWhere = [
        userId ? {"$user.id$" : userId } : {},
        // busqueda ? {"$personal.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const etapaWhere = [
        etapaId ? {"$etapa.id$" : etapaId } : {},
        // busqueda ? {"$actividad.etapa$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    // const tipoBitacoraWhere = [
    //     tipoBitacoraId ? {"$tipo_bitacora.id$" : tipoBitacoraId } : {},
    //     busqueda ? {"$tipo_bitacora.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    // ]


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
        const bitacoras = await Bitacora.findAndCountAll({
            include: [
                { model: TipoBitacora, attributes: ['nombre'] },
                { model: GaleriaBitacora, attributes: ['url', 'type'] },
                { model: Obra, attributes: ['id', 'nombre', 'centroCosto'], where: obraWhere },
                { model: Nivel, attributes: ['id', 'nombre'], where: nivelWhere},
                { model: Zona, attributes: ['nombre'], where: zonaWhere},
                { model: Etapas, attributes: ['nombre'], where: etapaWhere},
                {
                    model: User,
                    attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                    as: 'autorInt',
                    required: false,
                    where: Sequelize.where(Sequelize.col('bitacora.esInterno'), true),
                }, 
                {
                    model: Personal,
                    attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                    as: 'autorExt',
                    required: false,
                    where: Sequelize.where(Sequelize.col('bitacora.esInterno'), false),
                }, 
            ],
            order: [
                ['id', ordenSolicitado]
            ],
            // limit,
            // offset,
            distinct: true,
            where: {[Op.and] : [fechaWhere, busquedaWhere]},
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
        await Bitacora.findOne({
                where: { uid: req.params.uid },
                include: [
                    { model: TipoBitacora, attributes: ['id', 'nombre'] },
                    { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                    //  where id != 0
                    { model: Obra, attributes: ['id', 'nombre']},
                    { model: Nivel, attributes: ['id', 'nombre']},
                    { model: Zona, attributes: ['id', 'nombre']},
                    { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno' ] },
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
                        model: Personal,
                        attributes: ['nombre', 'apellidoPaterno', 'apellidoMaterno'],
                        as: 'autorExt',
                        required: false,
                        where: Sequelize.where(Sequelize.col('bitacora.esInterno'), false),
                    }, 
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

                actividad: fields.actividad,
                esInterno: fields.esInterno,                
                fecha: moment(new Date(fields.fecha)).format('YYYY-MM-DD HH:mm:ss'),

            }).then( async (bitacora) => {
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

                    
                    await bitacora.setUsers(participantes)
                    
                    if( participantes.length > 0 ){
                        await User.findAll({
                            where: { id: participantes }
                        }).then( async (users) => {                            
                            await reporteBitacora(req.user, tipoBitacora.dataValues.nombre, users)
                        }).catch( (error) => {
                            console.log(error);
                            res.status(500).json({ message: "Error al enviar reporte bitacora", error })
                        })
                    }
                    
                    res.status(200).json({ message: "Bitacora creada correctamente", bitacora })   

                }).catch( (error) => {
                    console.log(error);
                    res.status(500).json({ message: "Error al subir archivos", error })
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
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'], as: 'autorInt' },
                { model: Personal, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'], as: 'autorExt'},
                { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                { model: ComentariosBitacora, attributes: ['id', 'comentario', 'createdAt'], 
                    include: [
                        { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'] }, 
                        { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }
                    ]
                },
                { model: TipoBitacora, attributes: ['id', 'nombre'] },
                { model: Obra, attributes: ['id', 'nombre'] },
                { model: Nivel, attributes: ['id', 'nombre'] },
                { model: Zona, attributes: ['id', 'nombre'], as: 'zona'},

                
            ]
        }).then( async (bitacoras) => {
            generatePdf(res, bitacoras,  titulo, descripcion, comentarios, imagenes)
          
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
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'] }
            ]
        }).then( async (bitacora) => {
            const participantes = bitacora.users.map( item => item.id )
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
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'] }
            ]
        }).then( async (bitacora) => {
            const participantes = bitacora.users.map( item => item.id )
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
    const bitacora = bitacoras[0].dataValues
    const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <style>
            p {
                color: #646375;
                font-family: 'Roboto', sans-serif;
            }
        </style>
    </head>
        <table style="width: 100%; font-size: 8px; id="pageHeader">
            <tr>
                <td style="width:10%">
                    <img src="data:image/png;base64,${logoBase64}" style="width: 50px; height: 50px; padding:0 25%" />
                    </td>
                    <td style="width: 50%; text-align: right;">
                </td>
            </tr>
        </table>
    <body>

            <div>
                <h1 style="font-size: 20px;">${titulo}</h1>
                ${descripcion ? `<p style="font-size: 12px;">${descripcion}</p>` : ''}
            </div>

            <div>
                <h2 style="font-size: 16px;">Fecha: ${moment(bitacora.fecha).format('LLL') } </h2>
            </div>
            <div>
            
            <h3 style="font-size: 14px;">${ bitacora.obraId === 0 ? '' : `${bitacora.obra.dataValues.nombre} - ${ bitacora.nivelId === 0 ? '' : `${bitacora.nivel.dataValues.nombre} - ` } ${bitacora.zonaId === 0 ? '' : `${bitacora.zona.dataValues.nombre}` }` }</h3>    
                <p>
                    ${bitacora.descripcion}
                </p>
            </div>

            <div>
                ${ comentarios ? 
                    bitacora.comentarios_bitacoras.map( (comentario) => {
                        return `
                        <div>
                            <p style="font-size: 12px;">Autor: ${comentario.dataValues.user.nombre} ${comentario.dataValues.user.apellidoPaterno } </p>
                            <p style="font-size: 12px;">${comentario.dataValues.comentario}</p>

                            <p style="font-size: 12px;">Fecha: ${moment(bitacora.fecha).format('LLL') } </p>
                        </div>
                        <div style="display:flex; flex-direction:row; width:100%;">
                            ${ imagenes ?
                                comentario.galeria_comentarios.map( (imagen) => {
                                    return `
                                        <a href="https://spaces.erp-devarana.mx/${imagen.dataValues.url}" target="_blank">
                                            <img src="https://spaces.erp-devarana.mx/${imagen.dataValues.url}" style="width:50px; height: 50px; padding:0 25%" />
                                        </a>
                                    `
                                }).join('') : ''
                            }
                        <div>
                        `
                    }).join('') : ''
                }
            </div>
                <p style="font-size: 12px;">${bitacora.autorInt ? bitacora.autorInt.nombre : bitacora.autorExt.nombre } ${bitacora.autorInt ? bitacora.autorInt.apellidoPaterno : bitacora.autorExt.apellidoPaterno } </p>
            </div>

    </body>
    </html>
    `  
        pdf.create(
            content,
            {
                format: 'A4',
                orientation: 'portrait',
                border: {
                    top: '0.1in',
                    right: '0.2in',
                    bottom: '0.1in',
                    left: '0.2in'
                },
                footer: {
                    height: '0.5in',
                    contents: {
                        default: '<span style="color: #646375;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        first: '<span style="color: #646375;">{{page}}</span>/<span>{{pages}}</span>',
                        2: '<span style="color: #646375;">{{page}}</span>/<span>{{pages}}</span>',
                        last: '<span style="color: #646375;">{{page}}</span>/<span>{{pages}}</span>'
                    }
                }

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




        