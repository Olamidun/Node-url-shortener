const nodemailer = require('nodemailer')


const sendEmail = (email) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })
    
    const mailOptions = {
        from: "kolapoolamidun@gmail.com",
        to: email,
        subject: "Sending Email with Nodejs",
        text: "This is a simple text to verify sending of email"
    }

    transporter.sendMail(mailOptions, (err, info) =>{
        if(err){
            return err;
        } else {
            // console.log(info)
            return "Mail has been sent successfully"
        }
    })
}

module.exports = sendEmail


