const mailer = require('nodemailer');
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 2000
  });

exports.mailSender = (to, subject, html, extraAttachments = [], bcc) => {


    const attachments = [
        {
            filename: 'LogoDevarana.png',
            path: './static/img/LogoDevarana.png',
            cid: 'logo'
        },
    ]

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
        attachments: [...attachments, ...extraAttachments]
    };


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