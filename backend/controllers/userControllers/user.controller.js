const User = require("../../models/User");
const Ban = require("../../models/Ban");

// @desc    Obtienen el motivo, si esta activo y cuando expira
// @route   POST /api/user/mybans
// @access  Private (solo miembros)
const getMyBanHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const bans = await Ban.find({ user: userId })
            .select("reason type bannedAt expiresAt isActive")
            .sort({ createdAt: -1 });

        res.json(bans);
    } catch (error) {
        res.status(500).json({ messasge: "Error del servidor", error: error.messasge });
    }
};

module.exports = { getMyBanHistory };