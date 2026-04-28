const sendMail = require("./sendEmail");

// user
const sendPasswordChangeEmail = async (user, req) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "IP desconocida";
    const date = new Date().toLocaleString();

    await sendEmail(
        user.email,
        "Cambio de contraseña exitoso",
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Hola ${user.name || "Usuario"},</h2>
            
            <p>Tu contraseña ha sido cambiada correctamente.</p>

            <p><strong>Detalles del cambio:</strong></p>
            <ul>
                <li>Fecha: ${date}</li>
                <li>IP: ${ip}</li>
            </ul>

            <p>Si no realizaste este cambio, te recomendamos restablecer tu contraseña inmediatamente.</p>

            <br/>
            <p style="color: #777; font-size: 14px;">
                © ${new Date().getFullYear()} MiAplicación
            </p>
        </div>
        `
    );
};

// recoverPassword email (auth)
const sendRecoverPasswordEmail =async (user, token) => {
    const recoverLink = `${process.env.BACKEND_URL}/api/auth/recover/${token}`;

    await sendEmail(
        user.email,
        "Recuperación de contraseña",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
            <h2 style="color: #333; text-align: center;">${user.name || "Usuario"}</h2>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="color: #555; font-size: 16px;">
                Has solicitado recuperar tu contraseña en <strong>MiAplicación</strong>.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${recoverLink}" style="padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">
                    Recuperar contraseña
                </a>
            </div>

            <p>Este enlace expira en 15 minutos</p>

            <p style="font-size: 14px; color: #777;">
                Si no solicitaste este cambio, puedes ignorar este correo.
            </p>

            <p style="word-break: break-all; font-size: 12px;">
                ${recoverLink}
            </p>

            <hr />

            <p style="font-size: 12px; text-align: center; color: #999;">
                © ${new Date().getFullYear()} MiAplicación
            </p>
        </div>
        `
    );
}

// send Verification email (register)
const sendVerificationEmail = async (user, token) => {
    const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

    await sendEmail(
        user.email,
        "Verifica tu cuenta",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
            
            <h2 style="color: #333; text-align: center">
                Hola ${user.name || user.username}
            </h2>

            <hr style="margin: 30px 0; border-top: 1px solid #eee;" />

            <p style="color: #555; font-size: 16px;">
                Gracias por registrarte en <strong>Tecno Blog</strong>.
                Para completar tu registro, verifica tu cuenta:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyLink}" 
                   style="padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">
                   Verificar cuenta
                </a>
            </div>

            <p style="font-size: 14px; color: #777;">
                Este enlace expirará pronto por seguridad.
            </p>

            <p style="word-break: break-all; font-size: 12px;">
                ${verifyLink}
            </p>

            <hr />

            <p style="font-size: 12px; text-align: center; color: #999;">
                © ${new Date().getFullYear()} Tecno Blog
            </p>
        </div>
        `
    );
};

// retry verification email (auth)

module.exports = {
    sendPasswordChangeEmail,
    sendRecoverPasswordEmail,
    sendVerificationEmail
};