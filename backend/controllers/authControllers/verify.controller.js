const User = require("../../models/User");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

// @desc    Obtiene el Token de verificación y redirecciona a verify en el frontend
// @route   POST /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            verificationToken: token,
            vfTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/verify?status=error`);
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.vfTokenExpires = null;
        await user.save();

        return res.redirect(`${process.env.FRONTEND_URL}/verify?status=success`);
    } catch (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/verify?status=error`);
    }
};

// @desc    Reenvia el correo con token de verificación cuando este se encuentra expirado o sea invalido (antes resendVerification)
// @route   POST /api/auth/retry-verify
// @access  Public
const retryVerify = async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    try {
        const user = await User.findOne({ normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Usuario ya verificado" });
        }

        // Generamos un nuevo token de verificación con un tiempo de vida de 5 min
        const retryToken = crypto.randomBytes(32).toString("hex");

        user.verificationToken = retryToken;
        user.vfTokenExpires = Date.now() + 5 * 60 * 1000; // tiempo de vida de 5 min
        await user.save();

        const verifyLink = `${process.env.BACKEND_URL}/api/auth/verify/${retryToken}`;

        await sendEmail(
            email,
            "Verifica tu cuenta",
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                    <h2 style="color: #333; text-align: center;">👋 Hola ${user.name}</h2>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Gracias por registrarte en <strong>MiAplicación</strong>.  
                    Para completar tu registro, por favor verifica tu cuenta haciendo clic en el botón de abajo:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyLink}" 
                        style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                        Verificar mi cuenta
                    </a>
                    </div>
                    <p style="color: #777; font-size: 14px;">
                    Si el botón no funciona, copia y pega este enlace en tu navegador:
                    </p>
                    <p style="word-break: break-all; color: #2563eb; font-size: 14px;">
                    ${verifyLink}
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="color: #999; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} MiAplicación. Todos los derechos reservados.
                    </p>
                </div>
            `
        );

        res.json({ message: "Se envio un nuevo correo de verificación" });
    } catch (error) {
        res.status(500).json({ message: "Error del Servidor" });
    }
};

module.exports = { verifyEmail, retryVerify };