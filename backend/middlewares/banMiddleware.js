const isUserBanned = require("../utils/isUserBanned");

const checkBan = async (req, res, next) => {
    const ban = await isUserBanned(req.user._id);

    if (ban) {
        return res.status(403).json({
            message: "Tu cuenta esta baneada",
            reason: ban.reason,
            type: ban.type,
            expiresAt: ban.expiresAt
        });
    }

    next();
};

module.exports = checkBan;