const User = require("../models/User");
const Strike = require("../models/Strike");
const Ban = require("../models/Ban");

const getModerationStatsByUser = async (userId) => {
    const user = await User.findById(userId)
        .select("username role createdAt");

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const strikes = await Strike.find({ user: userId });
    const bans = await Ban.find({ user: userId });

    const totalStrikes = strikes.length;
    const activeStrikes = strikes.filter(s => s.status === "activo").length;
    const totalPoints = strikes.reduce((acc, s) => acc + s.points, 0);

    const totalBans = bans.length;
    const activeBans = bans.filter(b => b.isActive).length;

    const lastBan = await Ban.findOne({ user: userId })
        .sort({ createdAt: -1 });

    const lastStrike = await Strike.findOne({ user: userId })
        .sort({ createdAt: -1 });

    const daysActive = Math.max(
        1,
        (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const strikeRate = totalStrikes / daysActive;
    const banRate = totalBans / (totalStrikes || 1);

    return {
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
    };
};

const getGlobalModerationStats = async () => {
    const totalStrikes = await Strike.countDocuments();
    const totalBans = await Ban.countDocuments();
    const activeBans = await Ban.countDocuments({ isActive: true });

    const pointsAgg = await Strike.aggregate([
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$points" },
            },
        },
    ]);

    const totalPoints = pointsAgg[0]?.totalPoints || 0;

    const topStrikes = await Strike.aggregate([
        {
            $group: {
                _id: "$user",
                totalStrikes: { $sum: 1 },
                totalPoints: { $sum: "$points" }
            },
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 5 },
    ]);

    const populatedTopStrikes = await User.populate(topStrikes, {
        path: "_id",
        select: "username email role",
    });

    const recentBans = await Ban.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "username")
        .populate("bannedBy", "username");

    return {
        stats: {
            totalStrikes,
            totalBans,
            activeBans,
            totalPoints,
        },
        topUsers: populatedTopStrikes,
        recentBans,
    };
};

const getUserModerationSummary = async (userId) => {
    const totalStrikes = await Strike.countDocuments({ user: userId });

    const activeBan = await Ban.findOne({
        user: userId,
        isActive: true
    });

    // Estado del usuario (hay que ajustarlo posteriormente en las reglas)
    let status = "good";

    if (activeBan) {
        status = "banned";
    } else if (totalStrikes >= 2) {
        status = "warning";
    } else {
        status = "good";
    }

    const STATUS_MESSAGES = {
        good: "Tu cuenta está en buen estado",
        warning: "Tienes advertencias, evita sanciones",
        banned: "Tu cuenta está suspendida"
    };

    return {
        strikes: totalStrikes,
        isBanned: !!activeBan,
        status,
        message: STATUS_MESSAGES[status]
    };
};

module.exports = {
    getModerationStatsByUser,
    getGlobalModerationStats,
    getUserModerationSummary
};