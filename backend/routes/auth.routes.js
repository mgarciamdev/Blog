const express = require("express");
const { loginUser, refreshToken, logoutUser, registerUser, resetPassword, recoverPassword, verifyChangeToken, verifyEmail, retryVerify, reactivateAccount } = require("../controllers/authControllers/index");
const { loginLimiter, authActionLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registro (solo member)
router.post("/register", authActionLimiter, registerUser);

// Login (solo member)
router.post("/login", loginLimiter, loginUser);

// Verificación de email
router.get("/verify/:token", verifyEmail);
router.post("/retry-verify", authActionLimiter, retryVerify);

// Recuperar contraseña
router.post("/password/recover", authActionLimiter, recoverPassword);
router.get("/password/recover/:token", verifyChangeToken);
router.post("/password/reset-password/:token", resetPassword);

// Refresh token
router.post("/refresh", refreshToken);

// Reactivación de cuenta eliminada
router.post("/reactivate", authActionLimiter, reactivateAccount);

//Logout
router.post("/logout", protect, logoutUser);

module.exports = router;