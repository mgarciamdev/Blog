const isUserBanned = require("../utils/isUserBanned");

const checkBan = async (req, res, next) => {
    const ban = await isUserBanned(req.user._id);

    if (ban) {
        req.isUserBanned = true;
        req.ban = ban;
    } else {
        req.isUserBanned = false;
        req.ban = null;
    }

    next();
};

module.exports = { checkBan };