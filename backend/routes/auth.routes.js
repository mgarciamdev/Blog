const express = require("express");
const { loginUser, refreshToken, logoutUser, registerUser } = require("../controllers/authControllers/index");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas de autenticación
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/register", registerUser);

module.exports = router;