const { mailSender } = require("../utils/sendMail")


const createHTML = (body) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <style type="text/css">
        *, ::before, ::after {
            
            box-sizing: border-box;
            border-width: 0;
            margin: 0;
            padding: 0;        
        }       
    </style>
    <body style="background-color: #f9f9f9;">
        <div style="background-color:#56739B;padding: 25px 0;"> <img src="cid:logo" alt="Logo" style="max-width: 200px;margin: auto;display: block;"> </div>
        ${body}
    </body>
    </html>`

    return html
}


function cancelarVale( usuario, valeSalida, responsable){
    const body = `
                    <h1>Cancelación de Vale de Salida</h1>
                    <p>Hola ${usuario.nombre} ${usuario.apellidoPaterno} </p>
                    <p>El Vale de salida para la siguiente actividad: ${ valeSalida.actividad.nombre } ha sido cancelado</p>
                    <p> El vale ha sido cancelado por el usuario ${responsable.nombre} ${responsable.apellidoPaterno} </p>
                    ${valeSalida.comentarios ? `<p> Han Añadido los siguientes comentarios ${valeSalida.comentarios}</p>` : ''}
                    <p>Puedes ingresar a la plataforma aquí <a href="http://erp-devarana.mx/login">Ingresar</a> </p>
                `
    // mailSender(usuario.email, 'Cancelación de Vale de Salida', body)

}

function completarVale( usuario, valeSalida ){
    const body = `
                    
                        <h1>Entregado de Vale de Salida</h1>
                        <p>Hola ${usuario.nombre} ${usuario.apellidoPaterno} </p>
                        <p>El Vale de salida para la siguiente actividad: ${valeSalida.actividad.nombre} ha sido entregado</p>
                        <p>Puedes ingresar a la plataforma aquí <a href="http://erp-devarana.mx/login">Ingresar</a> </p>
                    
                `
    // mailSender(usuario.email, 'Completado de Vale de Salida', body)
}

async function solicitarPrestamo ( responsable, actividad, usuario ){
    const body = `
                <div style="margin:auto; max-width:600px; width:100%; padding:15px;">
                    <h1 style="color:#646375;text-align: center;">Solicitud de Préstamo</h1>
                    <p style="color:#646375;padding: 15px 0;font-size: 16px;">Hola <span style="color:#d64767;font-weight:800">${usuario.nombre} ${usuario.apellidoPaterno}</span>,</p>
                    <p style="color:#646375;padding: 15px 0;font-size: 16px;">El usuario <span style="color:#d64767; font-weight:800">${responsable.nombre} ${responsable.apellidoPaterno}</span> ha solicitado un prestamo para la siguiente actividad: <span style="font-weight:800">${actividad.nombre}</span>.</p>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px;">Puedes aprobar o rechazar la solicitud en la plataforma.</p>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px; font-weight:800">Recuerda que sin tu aprovación no se le dará su material.</p>
                    <a style="font-size: 16px; margin: 15px auto; text-align: center; max-width: 150px; width: 100%; display:block; padding: 10px 15px; color:#f9f9f9; background-color:#d64767; text-decoration: none; border-radius: 15px;" href="http://erp-devarana.mx/prestamos">Ingresa Aquí</a>
                    
                </div>
                <div style="background-color:#56739B;">
                    <p style="color:#f9f9f9;text-align: center; padding: 30px 50px; font-size: 14px;"> Para cualquier duda o aclaración favor de ponerse en contacto con 
                    <a style="color:#f9f9f9;font-weight:500;" href="mailto:abrahamalvarado@devarana.mx?subject=SG Almacén&body=Hola oye tengo un problema aquí adjunto evidencia.">Abraham Alvarado</a> del Departamento de Tecnología. </p>
                </div>
                `
    const html = createHTML(body)
    mailSender(usuario.email, 'Solicitud de Préstamo', html)
}


async function reporteBitacora ( autor, tipoBitacora, involucrados, uid, correos){

    console.log('correos', correos);

    const body = `
                <div style="margin:auto; max-width:600px; width:100%; padding:15px;">
                    <h1 style="color:#646375;text-align: center;">Reporte de ${tipoBitacora} </h1>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px;"> El usuario <span style="color:#d64767; font-weight:800">${autor.nombre} ${autor.apellidoPaterno}</span> ha creado un reporte de ${tipoBitacora} </p>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px;"> Los siguientes usuarios han sido involucrados en el reporte: </p>
                    <ul>
                        ${ involucrados.length > 0 ?  involucrados.map( usuario => `<li style="color:#646375;padding: 5px 0;font-size: 16px;">${usuario.nombre} ${usuario.apellidoPaterno}</li>`).join('') : '' }
                        ${
                            correos && correos.length > 0 ? 
                            correos.map( correo => `<li style="color:#646375;padding: 5px 0;font-size: 16px;">${correo}</li>`).join('') : ''
                        }
                    </ul>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px;"> Puedes ver el reporte en la plataforma </p>
                    <a style="font-size: 16px; margin: 15px auto; text-align: center; max-width: 150px; width: 100%; display:block; padding: 10px 15px; color:#f9f9f9; background-color:#d64767; text-decoration: none; border-radius: 15px;" href="http://erp-devarana.mx/bitacora/${uid}">Ingresa Aquí</a>                    
                </div>
                <div style="background-color:#56739B;">
                    <p style="color:#f9f9f9;text-align: center; padding: 30px 50px; font-size: 14px;"> Para cualquier duda o aclaración favor de ponerse en contacto con 
                    <a style="color:#f9f9f9;font-weight:500;" href="mailto:abrahamalvarado@devarana.mx?subject=SG Almacén&body=Hola oye tengo un problema aquí adjunto evidencia.">Abraham Alvarado</a> del Departamento de Tecnología. </p>
                </div>
    `
    const html = createHTML(body)
    
    
    involucrados.push(autor)
    involucrados.forEach( async usuario => {
        
        
        mailSender(usuario.email, `Reporte de ${tipoBitacora}`, html )

        if( correos.length > 0 ){
            correos.forEach( correo => {
                mailSender(correo, `Reporte de ${tipoBitacora}`, html )
            })
        }
    })
}


module.exports = {
    cancelarVale,
    completarVale,
    solicitarPrestamo,
    reporteBitacora
}