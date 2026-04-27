const {
    getModerationStatsByUser,
    getGlobalModerationStats
} = require("../../services/moderation.service");

// @desc    get moderation stats for a specific user
// @route   GET /api/moderation/users/:userId/stats
// @access  Private (admin | superadmin)
const getModerationStats = async (req, res) => {
    try {
        const data = await getModerationStatsByUser(req.params.userId);

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estadísticas",
            error: error.message,
        });
    }
};

// @desc    get global moderation stats
// @route   GET /api/moderation/stats
// @access  Private (admin | superadmin)
const getGlobalStats = async (req, res) => {
    try {
        const data = await getGlobalModerationStats();

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener estadísticas globales",
            error: error.message,
        });
    }
};

module.exports = { getGlobalStats, getModerationStats }