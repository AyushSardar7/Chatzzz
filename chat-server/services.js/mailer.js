const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const emailOptions = {
            from: "Talkkk support <tallkk@chatapp.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
            attachments: options.attachments 
        };

        await transporter.sendMail(emailOptions);
    } catch (err) {
        console.log(err);
    }
};

exports.sendEmail = async (args) => {
    if (process.env.NODE_ENV === "development") {
        return Promise.resolve();
    } else {
        return sendMail(args);
    }
};
