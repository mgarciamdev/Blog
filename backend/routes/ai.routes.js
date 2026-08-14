const express = require("express");
const router = express.Router();

const {
    generateBlogPost,
    generateBlogPostIdeas,
    generateCommentReply,
    generatePostSummary
} = require("../controllers/ai.controller");

const { aiLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");

router.post(
    "/generate",
    protect,
    authorize("admin", "superadmin"),
    aiLimiter,
    generateBlogPost
);

router.post(
    "/generate-ideas",
    protect,
    authorize("admin", "superadmin"),
    aiLimiter,
    generateBlogPostIdeas
);

router.post(
    "/generate-reply",
    protect,
    authorize("admin", "superadmin"),
    aiLimiter,
    generateCommentReply
);

router.post(
    "/generate-summary",
    protect,
    aiLimiter,
    generatePostSummary
);

module.exports = router;