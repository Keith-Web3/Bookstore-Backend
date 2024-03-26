const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendEmail = async function (options) {
  await transport.sendMail({
    sender: 'Olorunnishola Olamilekan',
    subject: options.subject,
    to: options.to,
    text: options.message,
  })
}

module.exports = sendEmail
