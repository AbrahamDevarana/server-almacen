const { mailSender } = require("../utils/sendMail")


function cancelarVale( usuario, valeSalida, responsable){
    const html = `
                    <h1>Cancelación de Vale de Salida</h1>
                    <p>Hola ${usuario.nombre} ${usuario.apellidoPaterno} </p>
                    <p>El Vale de salida para la siguiente actividad: ${ valeSalida.actividad.nombre } ha sido cancelado</p>
                    <p> El vale ha sido cancelado por el usuario ${responsable.nombre} ${responsable.apellidoPaterno} </p>
                    ${valeSalida.comentarios ? `<p> Han Añadido los siguientes comentarios ${valeSalida.comentarios}</p>` : ''}
                    <p>Puedes ingresar a la plataforma aquí <a href="http://erp-devarana.mx/login">Ingresar</a> </p>
                `
    mailSender(usuario.email, 'Cancelación de Vale de Salida', html)

}

function completarVale( usuario, valeSalida ){
    const html = `
                    <h1>Entregado de Vale de Salida</h1>
                    <p>Hola ${usuario.nombre} ${usuario.apellidoPaterno} </p>
                    <p>El Vale de salida para la siguiente actividad: ${valeSalida.actividad.nombre} ha sido entregado</p>
                    <p>Puedes ingresar a la plataforma aquí <a href="http://erp-devarana.mx/login">Ingresar</a> </p>
                `
    mailSender(usuario.email, 'Completado de Vale de Salida', html)
}



module.exports = {
    cancelarVale,
    completarVale
}