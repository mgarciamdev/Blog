const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const isUserBanned = require("../../utils/isUserBanned");
const { generateAccessToken } = require("../../utils/generateToken");

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "refresh token requerido" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select("_id role isVerified refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Refresh token inválido" });
        }

        // Verificamos si el usuario se encuentra o no se encuentra baneado del blog
        const ban = await isUserBanned(user._id);

        if (ban) {
            return res.status(403).json({ message: "Usuario Baneado", reason: ban.reason });
        }

        const newAccessToken = generateAccessToken(user._id, user.role);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Refresh Token expirado o inválido" });
    }
};

module.exports = { refreshToken };