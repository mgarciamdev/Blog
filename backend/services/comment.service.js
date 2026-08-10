const Comment = require("../models/Comment");
const CommentReaction = require("../models/CommentReaction");

const deleteCommentRecursive = async (commentId) => {
    // buscamos a los hijos directos
    const replies = await Comment.find({ parentComment: commentId });

    // Eliminar hijos primero (recursivo)
    for (let reply of replies) {
        await deleteCommentRecursive(reply._id);
    }

    // Eliminar reacciones del comentario actual
    await CommentReaction.deleteMany({ comment: commentId });

    //Eliminar el actual
    await Comment.deleteOne({ _id: commentId });
};

const handleReactionToComment = async (userId, commentId, type) => {
    const existing = await CommentReaction.findOne({
        user: userId,
        comment: commentId,
    });

    if (existing) {
        if (existing.type === type) {
            await existing.deleteOne();
            return { action: "removed" };
        } else {
            existing.type = type;
            await existing.save();
            return { action: "updated" };
        }
    }

    await CommentReaction.create({
        user: userId,
        comment: commentId,
        type,
    });

    return { action: "created" };
};

const hasUserReacted = async (userId, commentId) => {
    return await CommentReaction.findOne({
        user: userId,
        comment: commentId,
    });
}

module.exports = {
    deleteCommentRecursive,
    handleReactionToComment,
    hasUserReacted,
};