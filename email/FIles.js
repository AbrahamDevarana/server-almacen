
const { Readable } = require('stream');
const { mailSender } = require('../utils/sendMail');

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
        <div style="background-color:#56739B;">
            <p style="color:#f9f9f9;text-align: center; padding: 30px 50px; font-size: 14px;"> Para cualquier duda o aclaración favor de ponerse en contacto con 
            <a style="color:#f9f9f9;font-weight:500;" href="mailto:abrahamalvarado@devarana.mx?subject=SG Almacén&body=Hola oye tengo un problema aquí adjunto evidencia.">Abraham Alvarado</a> del Departamento de Tecnología. </p>
        </div>
    </body>
    </html>`

    return html
}


const sendFiles = async (destinatarios, fileName, file) => {


    const fileStream = new Readable();
    fileStream.push(file);
    fileStream.push(null);

    const attachments = [
        {
            filename: fileName,
            content: fileStream
        }
    ]

    

    const body = ` <div style="margin:auto; max-width:600px; width:100%; padding:15px;">
                    <h1 style="color:#646375;text-align: center;">Reporte de ${fileName} </h1>
                    <p style="color:#646375;padding: 5px 0;font-size: 16px;"> Se ha generado un reporte de bitácora. </p>                   
                </div>`

    
    const html = createHTML(body, 'Archivos Adjuntos', attachments)

    // mailSender('asdasd@asdasd.com', `Reporte de`, html, attachments)

    destinatarios.forEach( destinatario => {
        mailSender(destinatario, `Reporte de ${fileName}`, html, attachments)
    })


}


module.exports = {
    sendFiles
}