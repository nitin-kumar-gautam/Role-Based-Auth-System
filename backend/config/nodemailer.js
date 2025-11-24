import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth:{
        user:"9c319d001@smtp-brevo.com",
        pass:"bskffBDtWPOR9ch"
    }
})

export default transporter;