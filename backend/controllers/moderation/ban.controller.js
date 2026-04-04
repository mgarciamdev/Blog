const User = require("../../models/User");
const Ban = require("../../models/Ban");

const ROLE_HIERARCHY = {
    member: 1,
    admin: 2,
    superadmin: 3,
};

// @desc    Baneo de Usuarios
// @route   POST /api/admin/ban/:userId
// @access  Private (admin | superadmin)
const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason, durationInDays } = req.body;

        const userToBan = await User.findById(userId);

        if (!userToBan) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Control jerárquico
        if (
            ROLE_HIERARCHY[req.user.role] <=
            ROLE_HIERARCHY[userToBan.role]
        ) {
            return res.status(403).json({ message: "No tienes permisos para banear este usuario" });
        }

        // Ya esta baneado ?
        const existingBan = await Ban.findOne({
            user: userToBan._id,
            isActive: true,
        });

        if (existingBan) {
            return res.status(400).json({ message: "El usuario ya se encuentra baneado" });
        }

        const expiresAt = durationInDays
            ? new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000)
            : null;

        await Ban.create({
            user: userToBan._id,
            bannedBy: req.user._id,
            reason,
            expiresAt,
            type: expiresAt ? "temporal" : "permanente",
            isActive: true,
        });

        // Estado rápido en User
        userToBan.isBanned = true;
        await userToBan.save();

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

        // Actualizamos al usuario
        await User.findByIdAndUpdate(userId, {
            isBanned: false,
        });

        res.json({ message: "Usuario desbaneado exitosamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al desbanear usuario" });
    }
};

// @desc    Admin o Superadmin obtienen la lista completa de bans, quien lo aplico, motivo, tipo y fechas
// @route   GET /api/admin/bans/:userId
// @access  Private(superadmin | admin)
const getUserBanHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const bans = await Ban.find({ user: userId })
            .populate("bannedBy", "username role")
            .sort({ createdAt: -1 });

        res.json(bans);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los datos" });
    }
};

module.exports = { banUser, unbanUser, getUserBanHistory };