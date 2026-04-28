const express = require("express");
const { loginUser, refreshToken, logoutUser, registerUser, resetPassword, recoverPassword, verifyChangeToken, verifyEmail, retryVerify } = require("../controllers/authControllers/index");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registro (solo member)
router.post("/register", registerUser);

// Login (solo member)
router.post("/login", loginUser);

// Verificación de email
router.get("/verify/:token", verifyEmail);
router.post("/retry-verify", retryVerify);

// Recuperar contraseña
router.post("/password/recover", recoverPassword);
router.get("/password/recover/:token", verifyChangeToken);
router.post("/password/reset-password/:token", resetPassword);

// Refresh token
router.post("/refresh", refreshToken);

//Logout
router.post("/logout", protect, logoutUser);

module.exports = router;