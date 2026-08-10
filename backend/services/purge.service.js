const User = require("../models/User");
const SavedPost = require("../models/SavedPost");
const CommentReaction = require("../models/CommentReaction");

const GRACE_PERIOD_DAYS = 30;

// @desc    Purga definitivamente las cuentas eliminadas cuyo periodo de gracia ya expiró
const purgeExpiredAccounts = async ({ dryRun = false } = {}) => {
    const cutoffDate = new Date(Date.now() - GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

    // isDeleted: true está explícito en el filtro, así que el hook de User.js no lo sobreescribe
    // (solo actúa cuando la query no menciona isDeleted).
    const expiredUsers = await User.find({
        isDeleted: true,
        deletedAt: { $lte: cutoffDate },
    }).select("_id username email deletedAt");

    if (expiredUsers.length === 0) {
        return { pruged: 0, dryRun, users: [] };
    }

    const userIds = expiredUsers.map(u => u._id);

    if (dryRun) {
        return { purged: expiredUsers.length, dryRun: true, users: expiredUsers };
    }

    // Limpiamos datos personales sin valor de auditoría
    await SavedPost.deleteMany({ user: { $in: userIds } });
    await CommentReaction.deleteMany({ user: { $in: userIds } });

    // Borrado físico definitivo del usuario
    const result = await User.deleteMany({ _id: { $in: userIds } });

    return { purged: result.deletedCount, dryRun: false, users: expiredUsers };
};

module.exports = { purgeExpiredAccounts, GRACE_PERIOD_DAYS };