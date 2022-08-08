const { mailSender } = require("../utils/sendMail")

function mailNewUser (usuario) {
    const html = `
                    <h1>Bienvenido a la Sistema de Gestión de Obra </h1>
                    <p>Hola ${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}</p>
                    <p>Para poder ingresar al sistema, deberás usar tu email</p>
                    <p>${usuario.email}</p>
                    <p> En el siguiente enlace <a href="http://erp-devarana.mx/login">Ingresar</a> </p>
                `

    mailSender(usuario.email, 'Bienvenido a la plataforma de almacén', html)    
}


module.exports = {
    mailNewUser
}
