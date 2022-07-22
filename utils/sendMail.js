const mailer = require('nodemailer');

exports.mailSender = (to, subject, html) => {
    const transporter = mailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `Devarana <${process.env.EMAIL_USERNAME}>`,
        to: ` <${to}>`,
        subject: 'No Reply', subject,
        html: html
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