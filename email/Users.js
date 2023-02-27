const { mailSender } = require("../utils/sendMail")

function mailNewUser (usuario) {
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
        
        .table {
            border-collapse: collapse;
            border-spacing: 0;
        }
    </style>
    <body style="background-color: #f9f9f9;">
            
        <table style="width:100%; max-width: 600px; margin:auto; background-color: #fff;" cellspacing="0" cellpadding="0">
            <tr>
                <td style="background-color:#56739B;padding: 25px 0;"> <img src="cid:logo" alt="Logo" style="max-width: 200px;margin: auto;display: block;"> </td>
            </tr>
            <tr>
                <td>
    
                </td>
            </tr>
            <tr>
                <td>
                    <div style="padding: 25px 50px 0px">
                        <h1 style="color:#646375;text-align: center;">Bienvenid@ al Software de Gestión de Construcción</h1>
    
                        <p style="font-weight: bold;color:#646375;padding: 15px 0 15px; font-size: 18px;">
                            ${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno},
                        </p>
    
                        <p style="color:#646375;padding: 15px 0;font-size: 16px;">
                            Bienvenid@ al Software de Gestión de Construcción, en este momento tenemos listo tu usuario, para que puedas acceder al sistema y comenzar a utilizarlo.
                        </p>
                        <p style="color:#646375;padding: 15px 0;font-size: 16px;">
                            Para acceder al sistema ingresa a través del siguiente link:
                        </p>
                    </div>
                </td>
            </tr>
    
            <tr>
                <td>
                    <a style="font-size: 16px; margin: 15px auto; text-align: center; max-width: 150px; width: 100%; display:block; padding: 10px 15px; color:#f9f9f9; background-color:#d64767; text-decoration: none; border-radius: 15px;" href="http://erp-devarana.mx/login">Ingresa Aquí</a>
                </td>
            </tr>
    
            <tr style="background-color: #fff;"> 
                <td>
                    <p style="font-size: 14px; color: #646375;text-align: center; padding: 35px 0;"> Podrás acceder a través de tu computadora de escritorio y/o dispositivos móviles: </p>
                </td>
            </tr>
            <tr style="background-color: #fff;">
                <td style="text-align: center;">
                    <img src="cid:pc" alt="" style="width:120px;">                
                    <img src="cid:tablet" alt="" style="width:100px;">                
                    <img src="cid:phone" alt="" style="width:100px;">                
                </td>
            </tr>
    
            <tr style="background-color:#56739B;">
                <td>
                    <p style="color:#f9f9f9;text-align: center; padding: 30px 50px; font-size: 14px;"> Para cualquier duda o aclaración favor de ponerse en contacto con 
                    <a style="color:#f9f9f9;font-weight:500;" href="mailto:abrahamalvarado@devarana.mx?subject=SG Almacén&body=Hola oye tengo un problema aquí adjunto evidencia.">Abraham Alvarado</a> del Departamento de Tecnología. </p>
                </td>
            </tr>
    
        </table>
        
    </body>
    </html>`


    const extraAttachments = [
        {
            filename: 'pc.png',
            path: './static/img/pc.png',
            cid: 'pc'
        },
        {
            filename: 'phone.png',
            path: './static/img/phone.png',
            cid: 'phone'
        },
        {
            filename: 'tablet.png',
            path: './static/img/tablet.png',
            cid: 'tablet'
        }
    ]

    mailSender(usuario.email, 'Bienvenid@ al Software de Gestión de Almacén', html, extraAttachments)    
}


module.exports = {
    mailNewUser
}
