const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const { sendPasswordChangeEmail, sendRecoverPasswordEmail } = require("../../utils/emailHelper");

// @desc    Reset de contraseña con token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Token invalido o expirado"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.refreshToken = null;
        user.lastPasswordChange = Date.now();

        await user.save();

        await sendPasswordChangeEmail(user, req);

        res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

// @desc    Envia email con un link para recuperar la contraseña
// @route   POST /api/auth/recover
// @access  Public
const recoverPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "Si el email existe, recibirás instrucciones" });
        }

        // Generamos nuevo Token
        const recoverToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(recoverToken)
            .digest("hex");

        // Generamos un Token y expiración en la BD (Base de Datos)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Duración de 15 min
        await user.save();

        await sendRecoverPasswordEmail(user, recoverToken);

        res.json({
            message: "Se envio correctamente el correo de recuperación con exito"
        });

    } catch (error) {
        res.status(500).json({ message: "Error del Servidor" });
    }
}

// @desc    Validamos el link enviado desde el backend y redireccionamos al frontend
// @route   GET /api/auth/recover/:token
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

module.exports = { resetPassword, recoverPassword, verifyChangeToken };