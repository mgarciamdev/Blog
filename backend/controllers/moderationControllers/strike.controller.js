const Strike = require("../../models/Strike");
const User = require("../../models/User");
const Ban = require("../../models/Ban");

const ROLE_HIERARCHY = {
    member: 1,
    admin: 2,
    superadmin: 3,
};

// @desc    Crear un strike a un usuario
// @route   POST /api/moderation/strikes
// @access  Private (admin | superadmin)
const addStrike = async (req, res) => {
    try {
        const { userId, reason, points } = req.body;

        if (!reason || reason.trim() === "") {
            return res.status(400).json({
                message: "El motivo es obligatorio",
            });
        }

        if (req.user._id.toString() === userId) {
            return res.status(400).json({
                message: "No puedes aplicarte un strike a ti mismo",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // Jerarquía
        if (
            ROLE_HIERARCHY[req.user.role] <=
            ROLE_HIERARCHY[user.role]
        ) {
            return res.status(403).json({
                message: "No tienes permisos",
            });
        }

        const strikePoints = Math.max(1, parseInt(points) || 1);

        const strike = await Strike.create({
            user: userId,
            issuedBy: req.user._id,
            reason,
            points: strikePoints,
        });

        // Contar strikes activos
        const totalStrikes = await Strike.aggregate([
            { $match: { user: user._id, status: "activo" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$points" }
                }
            }
        ]);

        const total = totalStrikes[0]?.total || 0;

        // Evitar doble ban
        const existingBan = await Ban.findOne({
            user: user._id,
            isActive: true,
        });

        // Auto-ban si supera límite (ej: 3)
        if (total >= 3 && !existingBan) {
            await Ban.create({
                user: user._id,
                bannedBy: req.user._id,
                reason: "Acumulación de strikes",
                type: "temporal",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                isActive: true,
            });

            await User.findByIdAndUpdate(user._id, {
                isBanned: true,
            });
        }

        res.status(201).json({
            message: "Strike aplicado",
            strike,
            totalStrikes: total,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al aplicar strike",
            error: error.message,
        });
    }
};

// @desc    Obtener todos los strikes de un usuario específico
// @route   GET /api/moderation/strikes/:userId
// @access  Private (admin | superadmin)
const getUserStrikes = async (req, res) => {
    try {
        const { userId } = req.params;

        const strikes = await Strike.find({ user: userId })
            .populate("issuedBy", "username role")
            .sort({ createdAt: -1 });

        res.json(strikes);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener strikes",
        });
    }
};

// @desc    Eliminar un strike
// @route   DELETE /api/moderation/strikes/:strikeId
// @access  Private (admin | superadmin)
const removeStrike = async (req, res) => {
    try {
        const { strikeId } = req.params;

        const strike = await Strike.findById(strikeId);

        if (!strike) {
            return res.status(404).json({
                message: "Strike no encontrado"
            });
        }

        strike.status = "revocado";
        await strike.save();

        res.json({
            message: "Strike revocado correctamente",
            strike,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al revocar strike",
            error: error.message,
        });
    }
}

// @desc    Obtener mis propios strikes
// @route   GET /api/moderation/strikes/me
// @access  Private (member)
const getMyStrikes = async (req, res) => {
    try {
        const strikes = await Strike.find({
            user: req.user._id
        })
            .populate("issuedBy", "username role")
            .sort({ createdAt: -1 });

        res.json(strikes);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener tus strikes",
        });
    }
};

module.exports = { addStrike, getUserStrikes, removeStrike, getMyStrikes };