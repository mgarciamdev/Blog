const blockIfBanned = (req, res, next) => {
    if (req.isBanned) {
        return res.status(403).json({
            message: "Tu cuenta está baneada. No puedes realizar esta acción.",
            reason: req.ban?.reason,
            type: req.ban?.type,
            expiresAt: req.ban?.expiresAt
        });
    }

    next();
};

module.exports = { blockIfBanned };