const mailer = require('nodemailer');

exports.mailSender = (to, subject, html) => {
    const transporter = mailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `Devarana <${process.env.EMAIL_USERNAME}>`,
        to: ` <${to}>`,
        bcc: `<abrahamalvarado+sgo@devarana.mx>`,
        subject: 'No Reply', subject,
        html: html,
        attachments: [
            {
                filename: 'LogoDevarana.png',
                path: './static/img/LogoDevarana.png',
                cid: 'logo'
            },
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
    };

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    return true;
                }
            });
        }
    })
}