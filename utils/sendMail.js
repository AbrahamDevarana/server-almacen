const mailer = require('nodemailer');
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 2000
  });

exports.mailSender = (to, subject, html, attachments = false, bcc) => {

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
        bcc: `<abrahamalvarado+sgo@devarana.mx, ${bcc}>`,
        subject: 'No Reply', subject,
        html: html,
        attachments: attachments ? [
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
        ] : [
            {
                filename: 'LogoDevarana.png',
                path: './static/img/LogoDevarana.png',
                cid: 'logo'
            },
        ]
    };

    // transporter.verify(function (error, success) {
    //     if (error) {
    //         console.log(error);
    //         done(error);
    //     } else {
    //         transporter.sendMail(job.data, function (error, info) {
    //             if (error) {
    //                 console.log(error);
    //                 done(error);
    //             } else {
    //                 console.log('Email sent: ' + info.response);
    //                 done();
    //             }
    //         });
    //     }
    // });

    limiter.schedule(() => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        });
    });
}