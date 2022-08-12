const { mailSender } = require("../utils/sendMail")

function mailNewUser (usuario) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <style type="text/css">
        * {
            font-family: 'Roboto', sans-serif;
        }
    </style>
    <body style="background-color: #dbdbea;">
     
        <table style="max-width: 600px; margin:auto; background-color: #f9f9f9; padding: 20px 10px;">
            <tr>
                <td> <img src="cid:logo" alt="Logo" style="max-width: 200px;margin: auto;display: block;"></td>
            </tr>
    
        <tr>
                <td> <h1 style="color: #646375; text-align: center; font-size: 24px;">Bienvenido a la Sistema de Gestión de Vales de Almacén </h1> </td>
        </tr>
    
            <tr>
                <td style="color: #646375;text-align: center;">
                    <p>Hola <span style="color: #56739B;">${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}</span> </p>
                    <p>Bienvenido a la Sistema de Gestión de Vales de Almacén</p>
                    <p> Para poder ingresar al sistema deberás usar tu email corporativo </p>
                    <p style="color: #56739B;">${usuario.email}</p>
                </td>
            </tr>
    
            <tr>
                <td style="text-align: center;color: #646375;">
                    <p> En el siguiente enlace </p>
                </td>
            </tr>
    
            <tr>
                <td style="text-align: center;">
                    <a href="http://erp-devarana.mx/login" style="color: white; background: #646375; border-radius: 5px; padding: 5px 10px; text-decoration: none;">Ingresar</a>
                </td>
            </tr>
        </table>
        
    </body>
    </html>
                    
                `

    mailSender(usuario.email, 'Bienvenido a la plataforma de almacén', html)    
}


module.exports = {
    mailNewUser
}
