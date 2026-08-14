const express = require("express");
const router = express.Router();

const {
    addComment,
    updateComment,
    deleteComment,
    getAllComments,
    getCommentsByPost,
    reactToComment
} = require("../controllers/CommentControllers/index");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");
const { blockIfBanned } = require("../middlewares/blockIfBanned");
const { createContentLimiter, reactionLimiter } = require("../middlewares/rateLimiter");

/**
 * Crear comentario
 */
router.post("/:postId", protect, blockIfBanned, createContentLimiter, addComment);

/**
 * Obtener todos los comentarios (ADMIN)
 */
router.get("/", protect, authorize("admin", "superadmin"), getAllComments);

/**
 * Obtener los comentarios por post
 */
router.get("/post/:postId", getCommentsByPost);

/**
 * Actualizar comentario
 */
router.put("/:commentId", protect, blockIfBanned, updateComment);

/**
 * Eliminar comentario
 */
router.delete("/:commentId", protect, blockIfBanned, deleteComment);

/**
 * Reacciones (Like / Dislike)
 */
router.post("/:commentId/reaction", protect, blockIfBanned, reactionLimiter, reactToComment);

module.exports = router;