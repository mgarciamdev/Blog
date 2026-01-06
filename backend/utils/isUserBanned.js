const Ban = require("../models/Ban");

/**
 * Verificamos si un usuario esta baneado actualmente
 * @params {ObjectId} userId
 * @returns {Object|null} Ban activo o null
 */

const isUserBanned = async (userId) => {
    const ban = await Ban.findOne({
        user: userId,
        isActive: true,
        $or: [
            { type: "permanente" },
            { type: "temporal", expiresAt: { $gt: new Date() } }
        ]
    });

    return ban; // null si no está baneado
};

module.exports = isUserBanned;