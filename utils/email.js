const nodemailer = require('nodemailer')

const sendEmail = async function (options) {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transport.sendMail({
    from: 'Olorunnishola Olamilekan',
    subject: options.subject,
    to: options.to,
    text: options.message,
  })
}

module.exports = sendEmail
