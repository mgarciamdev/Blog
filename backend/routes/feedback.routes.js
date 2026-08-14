const express = require("express");
const router = express.Router();

const {
    createFeedback,
    getReceivedFeedbacks,
    markFeedbackAsRead,
    respondFeedback,
    deleteFeedback,
    getUnreadCount,
    getFeedbackResponse
} = require("../controllers/feedbackControllers/feedback.controller");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { createContentLimiter } = require("../middlewares/rateLimiter");

/**
 *  MEMBER
 */
router.post(
    "/",
    protect,
    createContentLimiter,
    createFeedback
);

router.get(
    "/my-feedbacks",
    protect,
    getFeedbackResponse
);


/**
 * ADMIN
 */
router.get(
    "/admin/unread-count",
    protect,
    authorize("admin", "superadmin"),
    getUnreadCount
);

router.get(
    "/admin",
    protect,
    authorize("admin", "superadmin"),
    getReceivedFeedbacks
);

router.put(
    "/admin/:id/read",
    protect,
    authorize("admin", "superadmin"),
    markFeedbackAsRead
);

router.put(
    "/admin/:id/respond",
    protect,
    authorize("admin", "superadmin"),
    respondFeedback
);

router.delete(
    "/admin/:id",
    protect,
    authorize("admin", "superadmin"),
    deleteFeedback
);

module.exports = router;