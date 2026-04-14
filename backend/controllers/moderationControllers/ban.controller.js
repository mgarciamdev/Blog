const User = require("../../models/User");
const Ban = require("../../models/Ban");

const ROLE_HIERARCHY = {
    member: 1,
    admin: 2,
    superadmin: 3,
};

// @desc    Baneo de Usuarios
// @route   POST /api/moderation/bans
// @access  Private (admin | superadmin)
const banUser = async (req, res) => {
    try {
        const { userId, reason, durationInDays } = req.body;

        if (!reason || reason.trim() === "") {
            return res.status(400).json({
                message: "El motivo del ban es obligatorio",
            });
        }

        if (req.user._id.toString() === userId) {
            return res.status(400).json({
                message: "No puedes banearte a ti mismo",
            });
        }

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

        let expiresAt = null;

        if (durationInDays) {
            const days = parseInt(durationInDays);

            if (isNaN(days) || days <= 0) {
                return res.status(400).json({
                    message: "Duración inválida",
                });
            }

            expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        }

        const newBan = await Ban.create({
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

        res.status(201).json({
            message: "Usuario baneado correctamente",
            ban: newBan,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al banear al usuario" });
    }
};

// @desc    Desbaneo de Usuarios
// @route   PATCH /api/moderation/bans/:userId/unban
// @access  Private
const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const userToUnban = await User.findById(userId);

        if (!userToUnban) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        if (
            ROLE_HIERARCHY[req.user.role] <=
            ROLE_HIERARCHY[userToUnban.role]
        ) {
            return res.status(403).json({
                message: "No tienes permisos para desbanear este usuario",
            });
        }

        const ban = await Ban.findOne({
            user: userId,
            isActive: true,
        });

        if (!ban) {
            return res.status(404).json({ message: "El usuario no esta baneado" });
        }

        ban.isActive = false;
        ban.unbannedAt = new Date();
        ban.unbannedBy = req.user._id;

        await ban.save();

        // Actualizamos al usuario
        await User.findByIdAndUpdate(userId, {
            isBanned: false,
        });

        res.json({
            message: "Usuario desbaneado exitosamente",
            ban,
        });

    } catch (error) {
        res.status(500).json({ message: "Error al desbanear usuario" });
    }
};

// @desc    Historial de bans
// @route   GET /api/moderation/bans/:userId
// @access  Private (admin | superadmin)
const getUserBanHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        // Validar usuario
        const user = await User.findById(userId).select("username email role");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        // Query params
        const {
            page = 1,
            limit = 10,
            status,
            type,
            admin,
            fromDate,
            toDate,
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, parseInt(limit) || 10));

        // Filtro base
        let filter = { user: userId };

        // Estado del ban
        if (status === "active") {
            filter.isActive = true;
        }

        if (status === "inactive") {
            filter.isActive = false;
        }

        // Tipo de ban
        if (type) {
            filter.type = type; // temporal | permanente
        }

        // Admin que baneó
        if (admin) {
            filter.bannedBy = admin;
        }

        // Rango de fechas
        if (fromDate || toDate) {
            filter.createdAt = {};

            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }

            if (toDate) {
                filter.createdAt.$lte = new Date(toDate);
            }
        }

        // Total
        const total = await Ban.countDocuments(filter);

        // Datos
        const bans = await Ban.find(filter)
            .populate("bannedBy", "username role")
            .populate("unbannedBy", "username role")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            user,
            filters: {
                status,
                type,
                admin,
                fromDate,
                toDate,
            },
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            bans,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener historial",
            error: error.message,
        });
    }
};

// @desc    Historia propio
// @route   POST /api/moderation/bans/me
// @access  Private (member)
const getMyBanHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        const filter = {
            user: req.user._id,
        };

        const total = await Ban.countDocuments(filter);

        const bans = await Ban.find(filter)
            .populate("bannedBy", "username role")
            .populate("unbannedBy", "username role")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            bans,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener historial de bans",
            error: error.message,
        });
    }
};

module.exports = { banUser, unbanUser, getUserBanHistory, getMyBanHistory };