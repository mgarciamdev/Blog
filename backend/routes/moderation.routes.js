const express = require("express");
const router = express.Router();

const { banUser, unbanUser, getUserBanHistory, getMyBanHistory, createAppeal, getMyAppeals, getAllAppeals, resolveAppeal, addStrike, getUserStrikes, removeStrike, getMyStrikes, getUserModerationTimeline, getModerationStats, getGlobalModerationStats } = require("../controllers/moderationControllers/index");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");

/**
 * BAN ROUTES
 */
router.post(
    "/bans",
    protect,
    authorize("admin", "superadmin"),
    banUser
);

// Historial propio (usuario)
router.get(
    "/bans/me",
    protect,
    getMyBanHistory
);

router.patch(
    "/bans/:userId/unban",
    protect,
    authorize("admin", "superadmin"),
    unbanUser
);

// Historial de bans (admin)
router.get(
    "/bans/:userId",
    protect,
    authorize("admin", "superadmin"),
    getUserBanHistory
);

/** 
 *  STRIKE ROUTES
*/
router.post(
    "/strikes",
    protect,
    authorize("admin", "superadmin"),
    addStrike
);

// Historial propio
router.get(
    "/strikes/me",
    protect,
    getMyStrikes
);

router.delete(
    "/strikes/:strikeId",
    protect,
    authorize("admin", "superadmin"),
    removeStrike
);

// Ver strikes de un usuario (admin)
router.get(
    "/strikes/:userId",
    protect,
    authorize("admin", "superadmin"),
    getUserStrikes
);

/**
 * APPEAL ROUTES
 */
router.post(
    "/appeals",
    protect,
    createAppeal
);

router.get(
    "/appeals/me",
    protect,
    getMyAppeals
);

router.get(
    "/appeals",
    protect,
    authorize("admin", "superadmin"),
    getAllAppeals
);

router.patch(
    "/appeal/:appealId",
    protect,
    authorize("admin", "superadmin"),
    resolveAppeal
);

/**
 * TIMELINE ROUTE
 */
router.get(
    "/users/:userId/timeline",
    protect,
    authorize("admin", "superadmin"),
    getUserModerationTimeline
);

/**
 * STATS ROUTES
 */
router.get(
    "/users/:userId/stats",
    protect,
    authorize("admin", "superadmin"),
    getModerationStats
);

router.get(
    "/stats",
    protect,
    authorize("admin", "superadmin"),
    getGlobalModerationStats
);

module.exports = router;