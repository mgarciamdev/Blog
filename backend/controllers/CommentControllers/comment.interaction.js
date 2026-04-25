const Comment = require("../../models/Comment");
const CommentReaction = require("../../models/CommentReaction");
const { handleReactionToComment } = require("../../services/comment.service");

// @desc    React (like/dilike) to a comment (toggle or switch reaction)
// @route   POST /api/comments/:commentId/reaction
// @access  Private (member | admin | superadmin)
const reactToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { type } = req.body;

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json({
                message: "Tipo de reacción inválido",
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comentario no encontrado",
            });
        }

        await handleReactionToComment(req.user._id, commentId, type);

        //Contamos las reacciones
        const [likes, dislikes, userReaction] = await Promise.all([
            CommentReaction.countDocuments({ comment: commentId, type: "like" }),
            CommentReaction.countDocuments({ comment: commentId, type: "dislike" }),
            CommentReaction.findOne({ user: req.user._id, comment: commentId })
        ]);

        res.json({
            message: "Reacción actualizada",
            likes,
            dislikes,
            likedByUser: userReaction?.type === "like",
            dislikedByUser: userReaction?.type === "dislike",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error en la reacción",
            error: error.message,
        });
    }
};

module.exports = {
    reactToComment,
};