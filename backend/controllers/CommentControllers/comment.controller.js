const Comment = require("../../models/Comment");
const BlogPost = require("../../models/BlogPost");
const { deleteCommentRecursive } = require("../../services/comment.service");
const CommentReaction = require("../../models/CommentReaction");

// @desc    Add a comment to a blog post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentComment } = req.body;

        // Validamos contenido
        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "El contenido del comentario es obligatorio",
            });
        }

        // Validar post
        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        // Validamos si parentComment si viene
        if (parentComment) {
            const parent = await Comment.findById(parentComment);

            if (!parent) {
                return res.status(404).json({
                    message: "Comentario padre no encontrado",
                });
            }

            if (parent.post.toString() !== postId) {
                return res.status(400).json({
                    message: "El comentario padre no pertenece a este post",
                });
            }
        }

        // crear comentario
        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content: content.trim(),
            parentComment: parentComment || null,
        });

        await comment.populate("author", "name profileImageUrl");

        res.status(201).json({
            message: "Comentario creado",
            comment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear el comentario",
            error: error.message
        });
    }
};

// @desc    Get all comments
// @route   GET /api/comments
// @access  Private (admin | superadmin)
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: 1 })
            .lean();

        // IDs
        const commentIds = comments.map(c => c._id);

        // reacciones
        const reactions = await CommentReaction.find({
            comment: { $in: commentIds }
        });

        // map
        const reactionMap = {};

        reactions.forEach(r => {
            const id = r.comment.toString();

            if (!reactionMap[id]) {
                reactionMap[id] = {
                    likes: 0,
                    dislikes: 0,
                    userReaction: null
                };
            }

            if (r.type === "like") reactionMap[id].likes++;
            if (r.type === "dislike") reactionMap[id].likes++;

            if (req.user && r.user.toString() === req.user._id.toString()) {
                reactionMap[id].userReaction = r.type;
            }
        });

        const commentMap = {};

        comments.forEach(comment => {
            const data = reactionMap[comment._id.toString()] || {};

            comment.like = data.likes || 0;
            comment.dislikes = data.dislikes || 0;

            comment.likedByUser = data.userReaction === "like";
            comment.dislikedByUser = data.userReaction === "dislike";

            comment.replies = [];
            commentMap[comment._id.toString()] = comment;
        });

        const nestedComments = [];

        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment.toString()];

                if (parent) {
                    parent.replies.push(comment);
                }

            } else {
                nestedComments.push(comment);
            }
        });

        res.json({
            total: comments.length,
            comments: nestedComments,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener todos los comentarios",
            error: error.message
        });
    }
};

// @desc    Get all comments for a blog post
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { mode = "tree" } = req.query;

        if (!postId) {
            return res.status(400).json({
                message: "PostId requerido"
            });
        }

        const post = await BlogPost.findById(postId)
            .select("title coverImageUrl");

        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: 1 })
            .lean();

        // Id de comments
        const commentsIds = comments.map(c => c._id);

        // trae todas las reacciones
        const reactions = await CommentReaction.find({
            comment: { $in: commentsIds }
        });

        // agrupar reacciones
        const reactionMap = {};

        reactions.forEach(r => {
            const id = r.comment.toString();

            if (!reactionMap[id]) {
                reactionMap[id] = {
                    likes: 0,
                    dislikes: 0,
                    userReaction: null,
                };
            }

            if (r.type === "like") reactionMap[id].likes++;
            if (r.type === "dislike") reactionMap[id].dislikes++;

            // reacción del usuario
            if (req.user && r.user.toString() === req.user._id.toString()) {
                reactionMap[id].userReaction = r.type;
            }
        });

        // inyectar en los comentarios
        comments.forEach(comment => {
            const data = reactionMap[comment._id.toString()] || {};

            comment.likes = data.likes || 0;
            comment.dislikes = data.dislikes || 0;

            if (req.user) {
                comment.likedByUser = data.userReaction === "like";
                comment.dislikedByUser = data.userReaction === "dislike";
            }

            comment.replies = [];
        });

        // árbol
        if (mode === "flat") {
            return res.json({
                post,
                total: comments.length,
                comments
            });
        }

        const commentMap = {};

        comments.forEach(comment => {
            //comment.replies = [];
            commentMap[comment._id.toString()] = comment;
        });

        const nestedComments = [];

        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment.toString()];

                if (parent) {
                    parent.replies.push(comment);
                }

            } else {
                nestedComments.push(comment);
            }
        });

        res.json({
            post,
            total: comments.length,
            comments: nestedComments
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los comentarios del Post",
            error: error.message
        });
    }
};

// @desc    Delete a comment and its replies
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comentario no encontrado"
            });
        }

        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = ["admin", "superadmin"].includes(req.user.role);

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "No tienes autorización para eliminar este comentario"
            });
        }

        // Eliminar árbol completo
        await deleteCommentRecursive(commentId);

        res.json({
            message: "Comentario y todas sus respuestas elminados"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el comentario",
            error: error.message
        });
    }
};

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: " Comentario no encontrado"
            });
        }

        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = ["admin", "superadmin"].includes(req.user.role);

        if (!isOwner && isAdmin) {
            return res.status(403).json({
                message: "No autorizado para editar este comentario",
            });
        }

        // Validación
        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "El contenido no puede estar vacio",
            });
        }

        const newContent = content.trim();

        if (comment.content !== newContent) {
            comment.content = content.trim();
            comment.edited = true;
        }

        await comment.save();

        await comment.populate("author", "name profileImageUrl");

        res.json({
            message: "Comentario actualizado",
            comment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el comentario",
            error: error.message
        });
    }
};

module.exports = {
    addComment,
    getAllComments,
    getCommentsByPost,
    deleteComment,
    updateComment
};