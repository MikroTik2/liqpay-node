const dotenv = require("dotenv").config();
const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smpt.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: {
            name: "Shopper Bot",
            address: process.env.EMAIL_USER,
        },
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    console.log(mailOptions);


    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
