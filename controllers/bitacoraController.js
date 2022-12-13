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
const { Op } = require('sequelize')
tinify.key = process.env.TINY_IMG_API_KEY;

// moment locale mx
moment.locale('es-mx')

exports.getBitacoras = async (req, res) => {


    const { userId, obraId, nivelId, zonaId, actividadId, personalId, tipoBitacoraId, fechaInicio, fechaFin, page, size, busqueda = "", ordenSolicitado = "DESC" } = req.query


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

    const actividadWhere = [
        actividadId ? {"$actividade.id$" : actividadId } : {},
        // busqueda ? {"$actividade.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const personalWhere = [
        personalId ? {"$personal.id$" : personalId } : {},
        // busqueda ? {"$personal.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
    ]

    const userWhere = [
        userId ? {"$user.id$" : userId } : {},
        // busqueda ? {"$personal.nombre$" : {[Op.like]: `%${busqueda}%`}} : {}
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
                {"$actividade.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$personal.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$autor.nombre$" : {[Op.like]: `%${busqueda}%`}},
                {"$autor.apellidoPaterno$" : {[Op.like]: `%${busqueda}%`}},
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
                { model: Actividad, attributes: ['nombre'], where: actividadWhere},
                { model: Personal, attributes: ['nombre'], where: personalWhere},
                { model: User, attributes: ['nombre', 'apellidoPaterno'], as: 'autor', where: userWhere },
                { model: User, attributes: ['nombre', 'apellidoPaterno'], where: userWhere },
            ],
            order: [
                ['id', ordenSolicitado]
            ],
            // limit,
            distinct: true,
            // offset,
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
                    ] },
                    {
                        model: User, as: 'autor' , attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'picture' ] 
                    }
                ]
            })
        res.status(200).json({bitacora})
    } catch (error) {
        console.loge(error);
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




exports.generateReport = async (req, res) => {
    const { titulo, descripcion, comentarios, imagenes, selectedOption = [] } = req.body
    
    

    try {

        await Bitacora.findAll({
            where: { id: selectedOption },
            include: [
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'], as: 'autor' },
                { model: GaleriaBitacora, attributes: ['id', 'url', 'type'] },
                { model: ComentariosBitacora, attributes: ['id', 'comentario', 'createdAt'], include: [{ model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno'] }, { model: GaleriaComentario, attributes: ['id', 'url', 'type'] }] },
                { model: TipoBitacora, attributes: ['id', 'nombre'] },
                { model: Obra, attributes: ['id', 'nombre'] },
                { model: Nivel, attributes: ['id', 'nombre'] },
                { model: Zona, attributes: ['id', 'nombre'] },
                { model: Actividad, attributes: ['id', 'nombre'] },
                { model: Personal, attributes: ['id', 'nombre'] },
                { model: User, attributes: ['id', 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]},
                
            ]
        }).then( async (bitacoras) => {
            generatePdf(res, bitacoras, titulo, descripcion, comentarios, imagenes)
          
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al generar el reporte", error })        
    }



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
    const bitacora = bitacoras[0]
    console.log(bitacora.comentarios_bitacoras);


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
                ${descripcion? `<p style="font-size: 12px;">${descripcion}</p>` : ''}
            </div>

            <div>
                <h2 style="font-size: 16px;">Fecha: ${moment(bitacora.fecha).format('LLL') } </h2>
            </div>
            <div>
                <h3 style="font-size: 14px;">${bitacora.obra.nombre} - ${bitacora.nivele.nombre } - ${bitacora.actividade.nombre } - ${bitacora.zona.nombre} </h3> 
                <p>
                    ${bitacora.informacionAdicional}
                </p>
            </div>

            <div>
                ${ comentarios ? 
                    bitacora.comentarios_bitacoras.map( (comentario) => {
                        return `
                        <div>
                            <p style="font-size: 12px;">Autor: ${comentario.user.nombre} ${comentario.user.apellidoPaterno } </p>
                            <p style="font-size: 12px;">${comentario.comentario}</p>

                            <p style="font-size: 12px;">Fecha: ${moment(bitacora.fecha).format('LLL') } </p>
                        </div>
                            <div style="display:flex; flex-direction:row;">
                                ${ imagenes ?
                                    comentario.galeria_comentarios.map( (imagen) => {
                                        // https://spaces.erp-devarana.mx/${imagen.url} add images from aws

                                        return `
                                            <img src="https://spaces.erp-devarana.mx/${imagen.url}" style="50px; height: 50px; padding:0 25%" />
                                        `
                                    }).join('') : ''
                                }
                            <div>
                        `
                    }).join('') : ''
                }
            </div>
            
                <p style="font-size: 12px;">${bitacora.autor.nombre} ${bitacora.autor.apellidoPaterno } </p>
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




        