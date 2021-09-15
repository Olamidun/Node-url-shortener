const nodemailer = require('nodemailer');

const sendEmail = (email, subject, payload) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });
  const mailOptions = {
    from: 'kolapoolamidun@gmail.com',
    to: email,
    subject,
    text: `Hi ${email}, you requested for a password reset, visit ${payload.link} to reset your email!`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return err;
    }
    // console.log(info)
    return 'Mail has been sent successfully';
  });
};

module.exports = sendEmail;
