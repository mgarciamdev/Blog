const express = require("express");
const router = express.Router();

const {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
    getPostByTag,
    searchPosts,
    getTopPosts,
    incrementView,
    likePost,
    dislikePost,
    savePost,
    unSavePost,
    getSavedPosts
} = require("../controllers/blogPostControllers/index");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { blockIfBanned } = require("../middlewares/blockIfBanned");
const { reactionLimiter } = require("../middlewares/rateLimiter");

/**
 * POST CORE
 */
router.post(
    "/",
    protect,
    authorize("admin", "superadmin"),
    createPost
);

router.get(
    "/",
    getAllPosts
);

router.put(
    "/:id",
    protect,
    authorize("admin", "superadmin"),
    updatePost
);

router.delete(
    "/:id",
    protect,
    authorize("admin", "superadmin"),
    deletePost
);

/**
 * POST QUERIES
 */
router.get(
    "/search",
    searchPosts
);

router.get(
    "/tags/:tag",
    getPostByTag
);

router.get(
    "/trending",
    getTopPosts
);

/**
 * POST INTERACTIONS
 */
router.post(
    "/:id/views",
    incrementView
);

/**
 * POST REACTIONS
 */
router.post(
    "/:id/likes",
    protect,
    blockIfBanned,
    reactionLimiter,
    likePost
);

router.post(
    "/:id/dislikes",
    protect,
    blockIfBanned,
    reactionLimiter,
    dislikePost
);

/**
 * SAVED POSTS
 */
router.post(
    "/:id/save",
    protect,
    blockIfBanned,
    reactionLimiter,
    savePost
);

router.delete(
    "/:id/save",
    protect,
    blockIfBanned,
    unSavePost
);

router.get(
    "/me/saved",
    protect,
    getSavedPosts
);

/**
 * SIEMPRE AL FINAL
 */
router.get(
    "/:slug",
    getPostBySlug
);

module.exports = router;