const Ban = require("../models/Ban");

const checkBan = async (req, res, next) => {
    const ban = await Ban.findOne({
        user: req.user._id,
        isActive: true,
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    });

    if (ban) {
        return res.status(403).json({
            message: "Tu cuenta esta baneada",
            reason: ban.reason
        });
    }

    next();
};

module.exports = checkBan;