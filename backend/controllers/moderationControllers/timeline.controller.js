const Ban = require("../../models/Ban");
const Strike = require("../../models/Strike");
const User = require("../../models/User");

// @desc    Timeline de moderación (bans + strike)
// @route   GET /api/moderation/users/:userId/timeline
// @access  Private (admin | superadmin)
const getUserModerationTimeline = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("username email role");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // Obtener bans
        const bans = await Ban.find({ user: userId })
            .populate("bannedBy", "username role")
            .populate("unbannedBy", "username role");

        // Obtener strikes
        const strikes = await Strike.find({ user: userId })
            .populate("issuedBy", "username role");

        // Transformar bans a eventos
        const banEvents = bans.flatMap(ban => {
            const events = [
                {
                    type: "ban",
                    action: ban.type, // temporal | permanente
                    reason: ban.reason,
                    date: ban.createdAt,
                    by: ban.bannedBy,
                    user: userId,
                    expiresAt: ban.expiresAt,
                }
            ];

            // Si fue desbaneado
            if (ban.unbannedAt) {
                events.push({
                    type: "unban",
                    action: "lifted",
                    reason: "Ban levantado",
                    date: ban.unbannedAt,
                    by: ban.unbannedBy,
                    user: userId,
                });
            }

            return events;
        });

        // Transformar strikes
        const strikeEvents = strikes.map(strike => ({
            type: "strike",
            action: "issued",
            reason: strike.reason,
            points: strike.points,
            date: strike.createdAt,
            by: strike.issuedBy,
            user: userId,
        }));

        // Unificar todo
        const timeline = [...banEvents, ...strikeEvents]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            user,
            total: timeline.length,
            timeline,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener timeline",
            error: error.message,
        });
    }
};

module.exports = { getUserModerationTimeline };