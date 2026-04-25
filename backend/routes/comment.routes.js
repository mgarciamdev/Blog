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
/**
 * Crear comentario
 */
router.post("/:postId", protect, addComment);

/**
 * Obtener todos los comentarios (ADMIN)
 */
router.get("/", protect, authorize("admin", "superadmin"), getAllComments);

/**
 * Obtener los comentarios por post
 */
router.get("/:postId", getCommentsByPost);

/**
 * Actualizar comentario
 */
router.put("/:commentId", protect, updateComment);

/**
 * Eliminar comentario
 */
router.delete("/:commentId", protect, deleteComment);

/**
 * Reacciones (Like / Dislike)
 */
router.post("/:commentId/reaction", protect, reactToComment);

module.exports = router;