const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

// @desc    Cambiamos y guardamos la nueva contraseña (antes resetpassword)
// @route   POST /api/auth/changePass
// @access  Public
const changePassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            rsPassTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalido o expirado" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.refreshToken = null;
        user.lastPasswordChange = Date.now();

        await user.save();

        await sendEmail(
            user.email,
            "Confirmación de cambio de contraseña",
            `
                <div style="font-family: Arial, sans-serif; padding: 20px;>
                    <h2 style="color: #333;">Hola ${user.username || "Usuario"},</h2>
                    <p>Tu contraseña en <strong>Mi Aplicación</strong> ha sido cambiada correctamente.</p>
                    <p>Si no realizaste este cambio, te recomendamos restablecerla inmediatamente o contactar a soporte.</p>
                    </br>
                    <p style="color: #777; font-size: 14px;">
                        © ${new Date().getFullYear()} MiAplicación
                    </p>
                </div>
            `
        );

        res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

// @desc    Envia email con un link con un token para recuperar la contraseña (antes forgotpassword)
// @route   POST /api/auth/recover
// @access  Public
const recoverPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "Si el email existe, recibirás instrucciones" });
        }

        // Generamos un Token unico que se envia al usuario que recupera la contraseña
        const recoverToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(recoverToken)
            .digest("hex");

        // Generamos un Token y expiración en la BD (Base de Datos)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Duración de 15 min
        await user.save();

        const recoverLink = `${process.env.BACKEND_URL}/api/auth/recover/${recoverToken}`;

        await sendEmail(
            email,
            "Recuperación de contraseña",
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                    <h2 style="color: #333; text-align: center;">${user.name || "Usuario"}</h2>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Has solicitado recuperar tu contraseña en <strong>MiAplicación</strong>.  
                        Para continuar, haz clic en el botón de abajo:
                    </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${recoverLink}" style="display: inline-block; padding: 12px 24px;        background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;"
                            >
                                Recuperación de contraseña
                            </a>
                        </div>
                    <p style="color: #777; font-size: 14px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:
                    </p>
                    <p style="word-break: break-all; color: #2563eb; font-size: 14px;">
                        ${recoverLink}
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} MiAplicación. Todos los derechos reservados.
                    </p>
                </div>
            `
        );

        res.json({ message: "Se envio correctamente el correo de recuperación con exito" });
    } catch (error) {
        res.status(500).json({ message: "Error del Servidor" });
    }
}

// @desc    Validamos el link enviado desde el backend y redireccionamos al frontend
// @route   GET /api/auth/verifyPass/:token
// @access  Public
const verifyChangeToken = async (req, res) => {
    const { token } = req.params;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            rsPassTokenExpires: { $gt: Date.now() }, // Verificamos que no este expirado
        });

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/changePass?status=invalid`);
        }

        return res.redirect(`${process.env.FRONTEND_URL}/changePass?token=${token}`);
    } catch (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/changePass?status=error`);
    }
};

module.exports = { changePassword, recoverPassword, verifyChangeToken };