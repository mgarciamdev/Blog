const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const GRACE_PERIOD_DAYS = 30;

// @desc    Reactivar una cuenta eliminada dentro del periodo de gracia
// @route   POST /api/auth/reactivate
// @access  Public
const reactivateAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                message: "Email y contraseña son obligatorios"
            });
        }

        const user = await User.findOneIncludingDeleted({
            email: normalizedEmail,
            deletedAt: { $ne: null },
        });

        if (!user || !user.isDeleted) {
            return res.status(404).json({
                message: "No hay ninguna cuenta eliminada con este email"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Contraseña incorrecta"
            });
        }

        if (user.deletedBy) {
            return res.status(403).json({
                message: "Esta cuenta fue eliminada por un administrador y no puede reactivarse."
            });
        }

        const daysSinceDeletion =
            (Date.now() - new Date(user.deletedAt)) / (1000 * 60 * 60 * 24);

        if (daysSinceDeletion > GRACE_PERIOD_DAYS) {
            return res.status(400).json({
                message: "El periodo para reactivar esta cuenta ya expiró"
            });
        }

        const taken = await User.findOne({
            $or: [{ email: user.email }, { username: user.username }],
        });

        if (taken) {
            return res.status(400).json({
                message: "El correo o nombre de usuario de esta cuenta ya está en uso. No se puede reactivar."
            });
        }

        user.isDeleted = false;
        user.deletedAt = null;

        await user.save();

        res.json({
            message: "Cuenta reactivada correctamente. Ya puedes iniciar sesión."
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al reactivar la cuenta",
            error: error.message
        });
    }
};

module.exports = { reactivateAccount };