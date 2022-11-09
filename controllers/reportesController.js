const moment = require('moment');
const sequelize = require('sequelize');
const db = require('../config/db');
const { getPagination, getPagingData } = require('../utils/paginacion');
const pdf = require('html-pdf');

const fs = require('fs');
const path = require('path');

// path




exports.getReportesAcumulados = async (req, res) => {

    const {  fechaInicial, fechaFinal, busqueda, centroCosto, orden, page, limit:size, ordenSolicitado, type} = req.query;

    const { limit, offset } = getPagination(page, size);


    let searchByCentroCosto = '';

    centroCosto ? centroCosto.forEach((element, index) => {
        searchByCentroCosto += `insumos.centroCosto = '${element.trim()}'`
        if(index !== centroCosto.length - 1){
            searchByCentroCosto += ` OR `
        }
        } ) : searchByCentroCosto = '';
    


    let where = ''
    let date = ''
    if (centroCosto){
        where += `AND (${searchByCentroCosto})`
    }

    if(busqueda){
        where += ` AND (insumos.nombre LIKE '%${busqueda}%' OR insumos.claveEnk LIKE '%${busqueda}%')`
    }

    if( fechaInicial && fechaFinal ){
        date += ` AND (detalle_salidas.updatedAt BETWEEN '${ moment(fechaInicial).format("YYYY-MM-DD HH:mm:ss") }' AND '${ moment(fechaFinal).format("YYYY-MM-DD HH:mm:ss") }')`
    }
    


    try {

        let reportData = { }

        const countQuery = await db.query({
            query: `SELECT COUNT( DISTINCT insumos.id) AS total FROM insumos
            LEFT JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            WHERE 1
            ${ where }
            ${ date }
            `           
        });


        reportQuery = `
            SELECT DISTINCT insumos.id, 
            insumos.nombre, 
            insumos.centroCosto,
            (SELECT SUM(detalle_salidas.cantidadEntregada) from detalle_salidas WHERE detalle_salidas.insumoId = insumos.id ${ date ? ` ${date} `: '' } ) as totalEntregado
            FROM insumos
            LEFT JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            WHERE 1
            ${ where }
            ${ ordenSolicitado? `ORDER BY totalEntregado ${ordenSolicitado}` : `ORDER BY insumos.id ${ orden }` }
            limit ${limit} offset ${offset}
        `

        await db.query(reportQuery, {
            logging: console.log,
            type: sequelize.QueryTypes.SELECT,
        }).then(data => {
            reportData.count = countQuery[0][0].total
            reportData.rows = data
            const response = getPagingData(reportData, page, limit);
            res.status(200).json(response);
        })

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: err.message })
    }
}

exports.getReporteGeneral = async (req, res) => {

    const {  fechaInicial, fechaFinal, busqueda, centroCosto, page, limit:size, actividad, lider, residente, status } = req.query;

    const { limit, offset } = getPagination(page, size);

    let where = ''
    let date = ''

    let searchByCentroCosto = '';

    centroCosto ? centroCosto.forEach((element, index) => {
        searchByCentroCosto += `insumos.centroCosto = '${element.trim()}'`
        if(index !== centroCosto.length - 1){
            searchByCentroCosto += ` OR `
        }
        } ) : searchByCentroCosto = '';

    if(centroCosto){
        where += `AND ${searchByCentroCosto}`
    }

    if(busqueda){
        where += `   AND ( insumos.nombre LIKE '%${busqueda}%' 
                        OR vale_salidas.id LIKE '%${busqueda}%' 
                        OR insumos.claveEnk LIKE '%${busqueda}%'
                        OR actividades.nombre LIKE '%${busqueda}%'
                        OR personals.nombre LIKE '%${busqueda}%'
                        OR personals.apellidoPaterno LIKE '%${busqueda}%'
                        OR personals.apellidoMaterno LIKE '%${busqueda}%'
                        OR users.nombre LIKE '%${busqueda}%'
                        OR users.apellidoPaterno LIKE '%${busqueda}%'
                        OR users.apellidoMaterno LIKE '%${busqueda}%'
                        OR vale_salidas.salidaEnkontrol LIKE '%${busqueda}%'
                    )`
    }

    if( fechaInicial && fechaFinal ){
        date += ` AND (vale_salidas.fecha BETWEEN '${ moment(fechaInicial).format("YYYY-MM-DD HH:mm:ss") }' AND '${ moment(fechaFinal).format("YYYY-MM-DD HH:mm:ss") }')`
    }

    if(actividad){
        where += ` AND (actividades.id = '${actividad}')`
    }
    if(lider){
        where += ` AND (personals.id = '${lider}')`
    }
    if(residente){
        where += ` AND (users.id = '${residente}')`
    }
    if(status && status !== ''){
        where += ` AND (detalle_salidas.status = ${status})`
    }


    try {

        let reportData = { }

        const countQuery = await db.query({
            query: `SELECT COUNT( insumos.id ) AS total 
            FROM insumos 
            INNER JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            INNER JOIN vale_salidas ON detalle_salidas.valeSalidaId = vale_salidas.id
            INNER JOIN actividades ON vale_salidas.actividadId = actividades.id
            INNER JOIN personals ON vale_salidas.personalId = personals.id
            INNER JOIN users ON personals.userId = users.id
            WHERE 1
            ${ where }
            ${ date }
            `           
        });


        reportQuery = `
            SELECT insumos.id, insumos.nombre as insumoNombre, insumos.claveEnk, insumos.centroCosto,
            detalle_salidas.cantidadSolicitada, detalle_salidas.cantidadEntregada,
            actividades.nombre as actividadNombre, personals.nombre as personalNombre, personals.apellidoPaterno, personals.apellidoMaterno,
            users.nombre as usuarioNombre, users.apellidoPaterno, vale_salidas.salidaEnkontrol, vale_salidas.fecha,
            concat(personals.nombre, ' (', personals.apellidoMaterno, ') ', personals.apellidoPaterno) as personal,
            concat(users.nombre, ' ', users.apellidoPaterno) as usuario,
            vale_salidas.id as folio,
            detalle_salidas.status
            FROM insumos 
            INNER JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            INNER JOIN vale_salidas ON detalle_salidas.valeSalidaId = vale_salidas.id
            INNER JOIN actividades ON vale_salidas.actividadId = actividades.id
            INNER JOIN personals ON vale_salidas.personalId = personals.id
            INNER JOIN users ON personals.userId = users.id
            WHERE 1
            ${ where }
            ${ date }
            limit ${limit} offset ${offset}
        `

        await db.query(reportQuery, {
            logging: console.log,
            type: sequelize.QueryTypes.SELECT,
        }).then(data => {
            reportData.count = countQuery[0][0].total
            reportData.rows = data
            const response = getPagingData(reportData, page, limit);
            res.status(200).json(response);
        })

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: err.message })
    }
}


exports.generateReporteAcumulados = async ( req, res ) => {
    const {  fechaInicial, fechaFinal, busqueda, centroCosto, orden, page, limit:size, ordenSolicitado, type} = req.query;

    let searchByCentroCosto = '';

    centroCosto ? centroCosto.forEach((element, index) => {
        searchByCentroCosto += `insumos.centroCosto = '${element.trim()}'`
        if(index !== centroCosto.length - 1){
            searchByCentroCosto += ` OR `
        }
        } ) : searchByCentroCosto = '';
    


    let where = ''
    let date = ''
    if (centroCosto){
        where += `AND (${searchByCentroCosto})`
    }

    if(busqueda){
        where += ` AND (insumos.nombre LIKE '%${busqueda}%' OR insumos.claveEnk LIKE '%${busqueda}%')`
    }

    if( fechaInicial && fechaFinal ){
        date += ` AND (detalle_salidas.updatedAt BETWEEN '${ moment(fechaInicial).format("YYYY-MM-DD HH:mm:ss") }' AND '${ moment(fechaFinal).format("YYYY-MM-DD HH:mm:ss") }')`
    }
    


    try {

        reportQuery = `
            SELECT DISTINCT insumos.id, 
            insumos.nombre, 
            insumos.centroCosto,
            (SELECT SUM(detalle_salidas.cantidadEntregada) from detalle_salidas WHERE detalle_salidas.insumoId = insumos.id ${ date ? ` ${date} `: '' } ) as totalEntregado
            FROM insumos
            LEFT JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            WHERE 1
            ${ where }
            ${ ordenSolicitado? `ORDER BY totalEntregado ${ordenSolicitado}` : `ORDER BY insumos.id ${ orden }` }
        `

        await db.query(reportQuery, {
            type: sequelize.QueryTypes.SELECT,
        }).then(data => {
            res.status(200).json(data);
        })

    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: err.message })
    }
}


exports.generateReporteGeneral = async ( req, res ) => {
    const {  fechaInicial, fechaFinal, busqueda, centroCosto, actividad, lider, residente, status } = req.query;

    try {

        let where = ''
        let date = ''

        let searchByCentroCosto = '';

        centroCosto ? centroCosto.forEach((element, index) => {
            searchByCentroCosto += `insumos.centroCosto = '${element.trim()}'`
            if(index !== centroCosto.length - 1){
                searchByCentroCosto += ` OR `
            }
            } ) : searchByCentroCosto = '';

        if(centroCosto){
            where += `AND ${searchByCentroCosto}`
        }

        if(busqueda){
            where += `   AND ( insumos.nombre LIKE '%${busqueda}%' 
                            OR vale_salidas.id LIKE '%${busqueda}%' 
                            OR insumos.claveEnk LIKE '%${busqueda}%'
                            OR actividades.nombre LIKE '%${busqueda}%'
                            OR personals.nombre LIKE '%${busqueda}%'
                            OR personals.apellidoPaterno LIKE '%${busqueda}%'
                            OR personals.apellidoMaterno LIKE '%${busqueda}%'
                            OR users.nombre LIKE '%${busqueda}%'
                            OR users.apellidoPaterno LIKE '%${busqueda}%'
                            OR users.apellidoMaterno LIKE '%${busqueda}%'
                            OR vale_salidas.salidaEnkontrol LIKE '%${busqueda}%'
                        )`
        }

        if( fechaInicial && fechaFinal ){
            date += ` AND (vale_salidas.fecha BETWEEN '${ moment(fechaInicial).format("YYYY-MM-DD HH:mm:ss") }' AND '${ moment(fechaFinal).format("YYYY-MM-DD HH:mm:ss") }')`
        }

        if(actividad){
            where += ` AND (actividades.id = '${actividad}')`
        }
        if(lider){
            where += ` AND (personals.id = '${lider}')`
        }
        if(residente){
            where += ` AND (users.id = '${residente}')`
        }
        if(status && status !== ''){
            where += ` AND (detalle_salidas.status = ${status})`
        }

        reportQuery = `
            SELECT insumos.id, insumos.nombre as insumoNombre, insumos.claveEnk, insumos.centroCosto,
            detalle_salidas.cantidadSolicitada, detalle_salidas.cantidadEntregada,
            actividades.nombre as actividadNombre, personals.nombre as personalNombre, personals.apellidoPaterno, personals.apellidoMaterno,
            users.nombre as usuarioNombre, users.apellidoPaterno, vale_salidas.salidaEnkontrol, vale_salidas.fecha,
            concat(personals.nombre, ' (', personals.apellidoMaterno, ') ', personals.apellidoPaterno) as personal,
            concat(users.nombre, ' ', users.apellidoPaterno) as usuario,
            vale_salidas.id as folio,
            detalle_salidas.status
            FROM insumos 
            INNER JOIN detalle_salidas on detalle_salidas.insumoId = insumos.id
            INNER JOIN vale_salidas ON detalle_salidas.valeSalidaId = vale_salidas.id
            INNER JOIN actividades ON vale_salidas.actividadId = actividades.id
            INNER JOIN personals ON vale_salidas.personalId = personals.id
            INNER JOIN users ON personals.userId = users.id
            WHERE 1
            ${ where }
            ${ date }
            `

        await db.query(reportQuery, {
            type: sequelize.QueryTypes.SELECT,
        }).then(data => {
            res.status(200).json(data);
        })
    
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: err.message })
    }
}


exports.generatePdf = async ( req, res ) => {

    const reporte = {}
    const { titulo, centroCosto, fechaInicial, fechaFinal, busqueda, actividad, lider, residente, status } = reporte

    const header = [
        { id: 'folio', name: 'ID', prompt: 'ID', width: 30, align: 'center', padding: 0 },
        { id: 'insumoNombre', name: 'Insumo', prompt: 'Insumo', width: 160, align: 'left', padding: 0 },
        { id: 'claveEnk', name: 'ID EK', prompt: 'ID EK', width: 50, align: 'center', padding: 0 },
        { id: 'centroCosto', name: 'Centro de Costo', prompt: 'Centro de Costo', width: 40, align: 'center', padding: 0 },
        { id: 'cantidadSolicitada', name: 'Cantidad Solicitada', prompt: 'Cantidad Solicitada', width: 40, align: 'center', padding: 0 },
        { id: 'cantidadEntregada', name: 'Cantidad Entregada', prompt: 'Cantidad Entregada', width: 40, align: 'center', padding: 0 },
        { id: 'actividadNombre', name: 'Actividad', prompt: 'Actividad', width: 100, align: 'left', padding: 0 },
        { id: 'personal', name: 'Personal', prompt: 'Personal', width: 140, align: 'left', padding: 0 },
        { id: 'usuario', name: 'Usuario', prompt: 'Usuario', width: 100, align: 'left', padding: 0 },
        { id: 'salidaEnkontrol', name: 'Salida Enkontrol', prompt: 'Salida Enkontrol', width: 50, align: 'center', padding: 0 },
        { id: 'fecha', name: 'Fecha', prompt: 'Fecha', width: 50, align: 'center', padding: 0 },
        { id: 'status', name: 'Status', prompt: 'Status', width: 40, align: 'center', padding: 0 },
    ]

    const data = [
        {
            "id": 1830,
            "insumoNombre": "GOMA CESPOL PARA LAVABO",
            "claveEnk": "1170006",
            "centroCosto": "RV2",
            "cantidadSolicitada": "1.00",
            "cantidadEntregada": "1.00",
            "actividadNombre": "Amueblado Hidrosanitario",
            "personalNombre": "J. Guadalupe ",
            "apellidoPaterno": "Evangelista ",
            "apellidoMaterno": "Lupe plomero",
            "usuarioNombre": "Luis Roberto",
            "salidaEnkontrol": "12166",
            "fecha": "2022-09-12T19:23:22.000Z",
            "personal": "J. Guadalupe  (Lupe plomero) Alvarez",
            "usuario": "Luis Roberto Evangelista ",
            "folio": 1,
            "status": 3
        },
        {
            "id": 1826,
            "insumoNombre": "CESPOL P/LAVABO S/CONTRA LATON CROM FOSET 49985 CE-210",
            "claveEnk": "1170002",
            "centroCosto": "RV2",
            "cantidadSolicitada": "1.00",
            "cantidadEntregada": "1.00",
            "actividadNombre": "Amueblado Hidrosanitario",
            "personalNombre": "J. Guadalupe ",
            "apellidoPaterno": "Evangelista ",
            "apellidoMaterno": "Lupe plomero",
            "usuarioNombre": "Luis Roberto",
            "salidaEnkontrol": "12166",
            "fecha": "2022-09-12T19:23:22.000Z",
            "personal": "J. Guadalupe  (Lupe plomero) Alvarez",
            "usuario": "Luis Roberto Evangelista ",
            "folio": 1,
            "status": 3
        },
        {
            "id": 1891,
            "insumoNombre": "MANGUERA COFLEX P/FREGADERO DE 55 CM AL-A40",
            "claveEnk": "1170073",
            "centroCosto": "RV2",
            "cantidadSolicitada": "2.00",
            "cantidadEntregada": "2.00",
            "actividadNombre": "Amueblado Hidrosanitario",
            "personalNombre": "J. Guadalupe ",
            "apellidoPaterno": "Evangelista ",
            "apellidoMaterno": "Lupe plomero",
            "usuarioNombre": "Luis Roberto",
            "salidaEnkontrol": "12166",
            "fecha": "2022-09-12T19:23:22.000Z",
            "personal": "J. Guadalupe  (Lupe plomero) Alvarez",
            "usuario": "Luis Roberto Evangelista ",
            "folio": 1,
            "status": 3
        },
        {
            "id": 2648,
            "insumoNombre": "PINTURA +MTS PRO-1000 K5-03 PULQUE",
            "claveEnk": "1240030",
            "centroCosto": "RV2",
            "cantidadSolicitada": "38.00",
            "cantidadEntregada": "38.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 1710,
            "insumoNombre": "RD+MIX CLASICO 7.5 KG",
            "claveEnk": "1090009",
            "centroCosto": "RV2",
            "cantidadSolicitada": "1.00",
            "cantidadEntregada": "1.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 2643,
            "insumoNombre": "SELLADOR 5X1 REFORZADO",
            "claveEnk": "1240003",
            "centroCosto": "RV2",
            "cantidadSolicitada": "19.00",
            "cantidadEntregada": "19.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 1708,
            "insumoNombre": "OK RESANADOR 950ML",
            "claveEnk": "1090007",
            "centroCosto": "RV2",
            "cantidadSolicitada": "2.00",
            "cantidadEntregada": "2.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 2648,
            "insumoNombre": "PINTURA +MTS PRO-1000 K5-03 PULQUE",
            "claveEnk": "1240030",
            "centroCosto": "RV2",
            "cantidadSolicitada": "19.00",
            "cantidadEntregada": "19.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 2643,
            "insumoNombre": "SELLADOR 5X1 REFORZADO",
            "claveEnk": "1240003",
            "centroCosto": "RV2",
            "cantidadSolicitada": "19.00",
            "cantidadEntregada": "19.00",
            "actividadNombre": "Pintura",
            "personalNombre": "Raul ",
            "apellidoPaterno": "Hernández ",
            "apellidoMaterno": "Rulas ",
            "usuarioNombre": "Luis Jesus",
            "salidaEnkontrol": "12167",
            "fecha": "2022-09-12T19:31:18.000Z",
            "personal": "Raul  (Rulas ) Vega Vega ",
            "usuario": "Luis Jesus Hernández ",
            "folio": 2,
            "status": 3
        },
        {
            "id": 1807,
            "insumoNombre": "PORTA ROLLO SENCILLO NEGRO MOEN",
            "claveEnk": "1150046",
            "centroCosto": "RV2",
            "cantidadSolicitada": "5.00",
            "cantidadEntregada": "5.00",
            "actividadNombre": "Amueblado Hidrosanitario",
            "personalNombre": "Eduardo ",
            "apellidoPaterno": "Gallegos ",
            "apellidoMaterno": "Tilo",
            "usuarioNombre": "Valeria",
            "salidaEnkontrol": "12168",
            "fecha": "2022-09-12T19:38:07.000Z",
            "personal": "Eduardo  (Tilo) Martinez",
            "usuario": "Valeria Gallegos ",
            "folio": 3,
            "status": 3
        }
    ]


    const content = `
        <!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>PDF Result Template</title>
                <style>
                    tr{
                        font-family: 'Roboto', sans-serif;
                        font-size: 8px;
                        color: #000;
                        margin: 0;
                        padding: 0;
                        border: 0;
                    }
                    thead{
                        font-family: 'Roboto', sans-serif;
                        font-size: 8px;
                        margin: 0;
                        padding: 0;
                        border: 0;
                        background-color: #56739B;
                    }
                    th{
                        font-family: 'Roboto', sans-serif;
                        color: #fff;
                        font-weight: 700;
                    }
                    td{
                        padding: 5px;
                    }
                </style>
            </head>
                <body>
                    <table>
                        <thead>
                            ${ header.map(heading => `<th>${heading.name}</th>`).join('') }
                        </thead>
                        <tbody>
                            ${ data.map(row => `
                                <tr>
                                    ${ header.map(column => {
                                        if(column.id === 'status'){
                                            if(row[column.id] === 1){
                                                return `<td style="width:${column.width}px;text-align:${column.align}">En Proceso</td>`
                                            }else if(row[column.id] === 3){
                                                return `<td style="width:${column.width}px;text-align:${column.align}">Entregado</td>`
                                            }else{
                                                return `<td style="width:${column.width}px;text-align:${column.align}">Cancelado</td>`
                                            }
                                        }else if(column.id === 'fecha'){
                                            return `<td style="width:${column.width}px;text-align:${column.align}">${moment(row[column.id]).format('DD/MM/YYYY')}</td>`
                                        }else{
                                            return `<td style="width:${column.width}px;text-align:${column.align}">${row[column.id]}</td>`
                                        }
                                    }).join('') }
                                </tr>
                            `).join('') }   
                        </tbody>
                </body>
            </html>
        `;

        
        
        
        pdf.create(content, {
            format: 'A4',
            orientation: 'landscape',
            border: {
                top: '0.1in',
                right: '0.2in',
                bottom: '0.1in',
                left: '0.2in'
            },
            header: {
                height: '1.3in',
                width: '100%',
                contents: ` 
                <table style="width: 100%; font-size: 8px; background:gray;" id="pageHeader">
                    <tr>
                        <td style="width:10%">
                            <img src="${ path.resolve('./static/img/logo.png') }"
                            style="width: 50px; height: 50px; padding:0 25%">
                            </td>
                            <td style="width: 50%; text-align: right;">
                            <h1 style="text-align:center">${titulo}</h1>
                            <h2 style="text-align:center"> Vales de Salida de Almacén </h2>
                        </td>
                        <td style="width:15%;padding:5px;">
                            <p> Centro de Costo: ${centroCosto} </p>
                            <p> Fecha de Inicio: ${fechaInicial} </p>
                            <p> Fecha Final: ${fechaFinal} </p>
                            <p> Busqueda: ${busqueda} </p>
                        </td>
                        <td style="width:15%;padding:5px;">
                            <p> Actividad: ${actividad} </p>
                            <p> Lider de cuadrilla: ${lider} </p>
                            <p> Usuario: ${residente} </p>
                            <p> Estatus: ${status} </p>
                        </td>
                    </tr>
                </table>
                `
            },
            footer: {
                height: '0.5in',
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    first: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                    2: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
                    last: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
                }
        }
    }).toFile(`./public/pdf/Reporte-${moment().format('DD-MM-YYYY-hh-mm')}.pdf`, (err, result) => {
        if(err){
            res.status(500).json({ message: 'Error al generar el pdf', error: err.message })
        }else{
            res.download(result.filename, (err) => {
                if(err){
                    res.status(500).json({ message: 'Error al descargar el pdf', error: err.message })
                }else{
                    fs.unlinkSync(result.filename)
                }
            })
        }
    })
}

