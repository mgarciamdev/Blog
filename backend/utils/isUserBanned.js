const Ban = require("../models/Ban");

/**
 * Verificamos si un usuario tiene un ban activo (temporal o permanente)
 * @param {ObjectId} userId - ID del usuario
 * @returns {Promise<Object|null>} Retorna el ban activo o null si no está baneado
 */

const isUserBanned = async (userId) => {
    const now = new Date();

    const ban = await Ban.findOne({
        user: userId,
        isActive: true,
        $or: [
            { type: "permanente" },
            { type: "temporal", expiresAt: { $gt: now } }
        ]
    });

    return ban; // null si no está baneado
};

module.exports = isUserBanned;