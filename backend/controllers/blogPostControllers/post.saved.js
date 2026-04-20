const SavedPost = require("../../models/SavedPost");
const BlogPost = require("../../models/BlogPost");

// @desc    Save a post
// @route   PUT /api/posts/:id/save
// @access  Private (member)
const savePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await BlogPost.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado",
            });
        }

        const exists = await SavedPost.findOne({
            user: userId,
            post: postId,
        });

        if (exists) {
            return res.status(400).json({
                message: "El post ya esta guardado"
            });
        }

        const saved = await SavedPost.create({
            user: userId,
            post: postId,
        });

        res.status(201).json({
            message: "Post guardado",
            saved,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
}

// @desc    Remove saved post
// @route   DELETE /api/posts/:id/save
// @access  Private (member)
const unSavePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const deleted = await SavedPost.findOneAndDelete({
            user: userId,
            post: postId,
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Post no guardado",
            });
        }

        res.json({ message: "Post eliminado de guardados" });

    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
}

// @desc    Get all saved post by user
// @route   GET /api/posts/saved
// @access  Private (member)
const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const { page = 1, limit = 10 } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        const filter = { user: userId };

        const total = await SavedPost.countDocuments(filter);

        const savedPosts = await SavedPost.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate({
                path: "post",
                select: "title slug coverImageUrl createdAt",
                populate: {
                    path: "author",
                    select: "username profileImageUrl"
                },
            });

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            savedPosts,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
};

module.exports = {
    savePost,
    unSavePost,
    getSavedPosts,
};