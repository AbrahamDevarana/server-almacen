const moment = require('moment');
const sequelize = require('sequelize');
const db = require('../config/db');
const { getPagination, getPagingData } = require('../utils/paginacion');


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

}


exports.generarteReporteGeneral = async ( req, res ) => {
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
            logging: console.log,
            type: sequelize.QueryTypes.SELECT,
        }).then(data => {
            res.status(200).json(data);
        })
    
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: err.message })
    }
}


