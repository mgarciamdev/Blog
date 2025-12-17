const User = require("../../models/User");
const Ban = require("../../models/Ban");

// @desc    Baneo de Usuarios
// @route   POST /api/admin/ban/:userId
// @access  Private
const banUser = async (req, res) => {
    try {
        const { userId, reason, durationInDays } = req.body;

        const userToBan = await User.findById(userId);

        if (!userToBan) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (userToBan.role !== "member") {
            return res.status(403).json({
                message: "Solo puedes banear a usuarios member"
            });
        }

        const expiresAt = durationInDays
            ? new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000)
            : null;

        const ban = await Ban.create({
            user: userToBan._id,
            bannedBy: req.user._id,
            reason,
            expiresAt,
            type: expiresAt ? "temporal" : "permanente",
        });

        res.status(201).json({ message: "Usuario baneado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al banear al usuario" });
    }
};

// @desc    Desbaneo de Usuarios
// @route   POST /api/admin/unban/:userId
// @access  Private
const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const ban = await Ban.findOne({
            user: userId,
            isActive: true,
        });

        if (!ban) {
            return res.status(404).json({ message: "El usuario no esta baneado" });
        }

        ban.isActive = false;
        await ban.save();

        res.json({ message: "Usuario desbaneado exitosamente" });

    } catch (error) {
        res.status(500).json({ message: "Errorr al desbanear usuario" });
    }
};

module.exports = { banUser, unbanUser };