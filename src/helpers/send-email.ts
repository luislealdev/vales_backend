import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // Set to true if using TLS
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export default async function sendEmail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: '"Más Óptica" <notificaciones@creativa2020.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error(error);
        // Handle email sending errors (optional: log to a file, retry, etc.)
    }
}