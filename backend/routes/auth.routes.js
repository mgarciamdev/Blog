const express = require("express");
const { loginUser, refreshToken, logoutUser, registerUser, changePassword, recoverPassword, verifyChangeToken, verifyEmail, retryVerify } = require("../controllers/authControllers/index");
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
router.post("/recover", recoverPassword);
router.get("/recover/:token", verifyChangeToken);
router.post("/changePass/:token", changePassword);

// Refresh token
router.post("/refresh", refreshToken);

//Logout
router.post("/logout", protect, logoutUser);

module.exports = router;