const express = require("express");
const router = express.Router();

const {
    generateBlogPost,
    generateBlogPostIdeas,
    generateCommentReply,
    generatePostSummary
} = require("../controllers/ai.controller");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");

router.post(
    "/generate",
    protect,
    authorize("admin", "superadmin"),
    generateBlogPost
);

router.post(
    "/generate-ideas",
    protect,
    authorize("admin", "superadmin"),
    generateBlogPostIdeas
);

router.post(
    "/generate-reply",
    protect,
    authorize("admin", "superadmin"),
    generateCommentReply
);

router.post(
    "/generate-summary",
    generatePostSummary
);

module.exports = router;