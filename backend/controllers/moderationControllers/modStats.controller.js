const Strike = require("../../models/Strike");
const Ban = require("../../models/Ban");
const User = require("../../models/User");

// @desc    
// @route   GET /api/moderation/users/:userId/stats
// @access  Private (admin | superadmin)
const getModerationStats = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("username role createdAt");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        // STRIKES
        const strikes = await Strike.find({ user: userId });

        const totalStrikes = strikes.length;
        const activeStrikes = strikes.filter(s => s.status === "activo").length;
        const totalPoints = strikes.reduce((acc, s) => acc + s.points, 0);

        // BANS
        const bans = await Ban.find({ user: userId });

        const totalBans = bans.length;
        const activeBans = bans.filter(b => b.isActive).length;

        // ULTIMOS EVENTOS
        const lastBan = bans.sort((a, b) => b.createdAt - a.createdAt)[0] || null;
        const lastStrike = strikes.sort((a, b) => b.createdAt - a.createdAt)[0] || null;

        // MÉTRICAS INTELIGENTES
        const daysActive = Math.max(
            1,
            (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        );

        const strikeRate = totalStrikes / daysActive;
        const banRate = totalBans / (totalStrikes || 1);

        res.json({
            user,
            stats: {
                totalStrikes,
                activeStrikes,
                totalPoints,
                totalBans,
                activeBans,
                strikeRate: Number(strikeRate.toFixed(2)),
                banRate: Number(banRate.toFixed(2)),
                lastBan,
                lastStrike,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estadísticas",
            error: error.message,
        });
    }
};

// @desc    
// @route   GET /api/moderation/stats
// @access  Private (admin | superadmin)
const getGlobalModerationStats = async (req, res) => {
    try {
        // Totales
        const totalStrikes = await Strike.countDocuments();
        const totalBans = await Ban.countDocuments();
        const activeBans = await Ban.countDocuments({ isActive: true });

        // Puntos totales
        const pointsAgg = await Strike.aggregate([
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: "$points" },
                },
            },
        ]);

        const totalPoints = pointsAgg[0]?.totalPoints || 0;

        // Top usuarios con más strikes
        const topStrikes = await Strike.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalStrikes: { $sum: 1 },
                    totalPoints: { $sum: "$points" },
                },
            },
            { $sort: { totalPoints: -1 } },
            { $limit: 5 },
        ]);

        // Popular usuarios
        const populatedTopStrikes = await User.populate(topStrikes, {
            path: "_id",
            select: "username email role",
        });

        // Bans recientes
        const recentBans = await Ban.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "username")
            .populate("bannedBy", "username");

        res.json({
            stats: {
                totalStrikes,
                totalBans,
                activeBans,
                totalPoints,
            },
            topUsers: populatedTopStrikes,
            recentBans,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estadísticas globales",
            error: error.message,
        });
    }
};

module.exports = { getGlobalModerationStats, getModerationStats }