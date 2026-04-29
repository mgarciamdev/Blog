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

// Privadas
router.get(
    "/profile",
    protect,
    getMyProfile
);

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
    "/change-password",
    protect,
    changePassword
);

router.delete(
    "/me",
    protect,
    deleteMyAccount
);

// Publicas
router.get(
    "/check",
    checkUsername
);

router.get(
    "/:id",
    getUserById
);

module.exports = router;