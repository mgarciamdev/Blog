const rateLimit = require("express-rate-limit");

// Respuesta consistente con el formato que ya no usas en el resto de la API
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        message: "Demasiadas solicitudes. Intenta de nuevo más tarde."
    });
}

// Login: Protección contra ataques de fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skipSuccessfulRequests: true,
});

// Registro / Recuperación / reactivación / reenvío de verificación
const authActionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

// IA: control de costo, no de aboso anónimo
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

// Creación de contenido: comentarios y feedback
const createContentLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

// Reacciones (likes/dislikes/saves): más permisivo, es un solo clic normal
const reactionLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

// General: red de seguridad amplia para toda la API
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

module.exports = {
    loginLimiter,
    authActionLimiter,
    aiLimiter,
    createContentLimiter,
    reactionLimiter,
    globalLimiter,
};