const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    try {
        // Configuración del trasnportador
        const transporter = nodemailer.createTransport({
            service: "gmail", // se puede cambiar y utilizar cualquier proveedor SMTP
            auth: {
                user: process.env.EMAIL_USER, // Tu email
                pass: process.env.EMAIL_PASS, // Contraseña o App Password
            },
        });

        // Opciones del correo
        const mailOptions = {
            from: `"Mi App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        // Envio del correo
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado a: ${to}, correctamente`);

    } catch (error) {
        console.error("Error al enviar el email!!", error);
        throw new Error("No se pudo enviar el email");
    }
};

module.exports = sendEmail;