const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    updateProfile,
    getUserById,
    changePassword,
    updateUsername,
    deleteMyAccount,
    checkUsername
} = require("../controllers/userControllers/user.controller");

const { protect } = require("../middlewares/authMiddleware");

// Publicas
router.get(
    "/check",
    checkUsername
);

router.get(
    "/:id",
    getUserById
);

// Privadas
router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
    "/username",
    protect,
    updateUsername
);

router.put(
    "/password",
    protect,
    changePassword
);

router.delete(
    "/me",
    protect,
    deleteMyAccount
);

module.exports = router;