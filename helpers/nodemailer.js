const nodemailer = require("nodemailer")

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "donasiyukhacktiv8@gmail.com",
        pass: "Hacktiv8"
    }
})

function sendMail(email, subject, message){
    const options = {
        from: "donasiyukhacktiv8@gmail.com",
        to: email,
        subject: subject,
        text: message
    }
    
    return mailTransporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = { sendMail }