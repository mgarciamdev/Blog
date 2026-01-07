const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, type: "access", role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId, type: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};