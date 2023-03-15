const { mailSender } = require("../utils/sendMail")
const { createHTML } = require("./Notificaciones")

function resetPasswordMail(email, newPassword){
    const body = `
        <div style="margin:auto; max-width:600px; width:100%; padding:15px;">
            <p style="color:#646375;padding-top: 15px;font-size: 18px;text-align:center;">Bitácora de Obra Digital</p>
            <h1 style="color:#646375;text-align: center;padding-bottom:10px;">Registro de ${tipoBitacora} </h1>
            <p style="color:#646375;padding: 5px 0;font-size: 16px;"> El usuario <span style="color:#d64767; font-weight:800">${autor.nombre} ${autor.apellidoPaterno}</span> ha creado un Registro de ${tipoBitacora} de ${ proyecto } </p>
            <p style="color:#646375;padding: 5px 0;font-size: 16px;"> Los siguientes usuarios han sido incluidos en la notificación de dicho reporte: </p>
            <ul>
                ${ involucrados.length > 0 ?  involucrados.map( usuario => `<li style="color:#646375;padding: 5px 0;font-size: 16px;">${usuario.nombre} ${usuario.apellidoPaterno}</li>`).join('') : '' }
                ${
                    correosParticipantes && correosParticipantes.length > 0 ? 
                    correosParticipantes.map( correo => `<li style="color:#646375;padding: 5px 0;font-size: 16px;">${correo}</li>`).join('') : ''
                }
            </ul>
            <p style="color:#646375;padding: 5px 0;font-size: 16px;"> Puedes conocer más detalles ingresando a la plataforma de Bitácora de Obra Digital: </p>
            <a style="font-size: 16px; margin: 15px auto; text-align: center; max-width: 150px; width: 100%; display:block; padding: 10px 15px; color:#f9f9f9; background-color:#d64767; text-decoration: none; border-radius: 15px;" href="http://erp-devarana.mx/bitacora/${uid}">Ingresa Aquí</a>                    
        </div>`

        const html = createHTML(body)

        mailSender(email, 'Restablecimiento de contraseña', html)
}

module.exports = {
    resetPasswordMail
}