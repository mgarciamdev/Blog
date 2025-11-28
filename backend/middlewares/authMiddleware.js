const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para la protección de las rutas
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; // Extrae el Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "No autorizado, no hay token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Fallo de Token", error: error.message });
    }
};

module.exports = { protect };