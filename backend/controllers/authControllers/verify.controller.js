const User = require("../../models/User");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const { sendVerificationEmail } = require("../../utils/emailHelper");

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

// @desc    Reenviar email de verificación
// @route   POST /api/auth/retry-verify
// @access  Public
const retryVerify = async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    try {
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(200).json({
                message: "Si el email existe, se enviará un nuevo enlace"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Usuario ya verificado"
            });
        }

        // Generamos un nuevo token de verificación
        const retryToken = crypto.randomBytes(32).toString("hex");

        user.verificationToken = retryToken;
        user.vfTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hora

        await user.save();

        await sendVerificationEmail(user, retryToken);

        res.json({
            message: "Se envio un nuevo correo de verificación"
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error al enviar nuevo correo de confirmación",
            error: error.message
        });
    }
};

module.exports = { verifyEmail, retryVerify };