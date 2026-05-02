const User = require("../models/User");
const Strike = require("../models/Strike");
const Ban = require("../models/Ban");
const mongoose = require("mongoose");

const getModerationStatsByUser = async (userId) => {
    const user = await User.findById(userId)
        .select("username role createdAt");

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const bans = await Ban.find({ user: userId });

    const strikesStatsAgg = await Strike.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: null,
                totalStrikes: { $sum: 1 },
                activeStrikes: {
                    $sum: {
                        $cond: [
                            { $eq: ["status", "activo"] },
                            "$points",
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const strikeStats = strikesStatsAgg[0] || {
        totalStrikes: 0,
        activeStrikes: 0,
        totalPoints: 0
    };

    const totalStrikes = strikeStats.totalStrikes;
    const activeStrikes = strikeStats.activeStrikes;
    const totalPoints = strikeStats.totalPoints;

    const totalBans = bans.length;
    const activeBans = bans.filter(b => b.isActive).length;

    const lastBan = await Ban.findOne({ user: userId })
        .sort({ createdAt: -1 });

    const lastStrike = await Strike.findOne({ user: userId })
        .sort({ createdAt: -1 });

    const daysActive = Math.max(
        1,
        Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
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
    const activeStrikes = await Strike.countDocuments({ status: "activo" });

    const totalBans = await Ban.countDocuments();
    const activeBans = await Ban.countDocuments({ isActive: true });

    const pointsAgg = await Strike.aggregate([
        { $match: { status: "activo" } },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$points" },
            },
        },
    ]);

    const totalPoints = pointsAgg[0]?.totalPoints || 0;

    const topUsersbyStrikes = await Strike.aggregate([
        { $match: { status: "activo" } },
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

    const populatedTopStrikes = await User.populate(topUsersbyStrikes, {
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
            activeStrikes,
            totalBans,
            activeBans,
            totalPoints,
        },
        topUsers: populatedTopStrikes,
        recentBans,
    };
};

const getUserModerationSummary = async (userId) => {
    const [activeStrikes, activeBan] = await Promise.all([
        Strike.countDocuments({
            user: userId,
            status: "activo"
        }),
        Ban.findOne({
            user: userId,
            isActive: true
        })
    ]);

    // Estado del usuario (hay que ajustarlo posteriormente en las reglas)
    let status = "good";

    const STRIKE_WARNING_THRESHOLD = 2;

    if (activeBan) {
        status = "banned";
    } else if (activeStrikes >= STRIKE_WARNING_THRESHOLD) {
        status = "warning";
    } else {
        status = "good";
    }

    const STATUS_MESSAGES = {
        good: "Tu cuenta está en buen estado",
        warning: "Tienes advertencias, evita sanciones",
        banned: "Tu cuenta está suspendida"
    };

    const remainingToWarning = Math.max(
        0,
        STRIKE_WARNING_THRESHOLD - activeStrikes
    )

    return {
        strikes: activeStrikes,
        isBanned: !!activeBan,
        status,
        message: STATUS_MESSAGES[status],
        remainingToWarning
    };
};

const calculateActiveStrikePoints = async (userId) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const result = await Strike.aggregate([
        { $match: { user: objectUserId, status: "activo" } },
        {
            $group: {
                _id: null,
                total: { $sum: "$points" }
            }
        }
    ]);

    return result[0]?.total || 0;
};

module.exports = {
    getModerationStatsByUser,
    getGlobalModerationStats,
    getUserModerationSummary,
    calculateActiveStrikePoints
};