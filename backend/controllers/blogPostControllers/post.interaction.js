const BlogPost = require("../../models/BlogPost");
const { handleReaction, incrementPostView } = require("../../services/post.service");

// @desc    Increment post like count
// @route   POST /api/posts/:id/like
// @access  Private (member)
const likePost = async (req, res) => {
    try {
        const userId = req.user._id;

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        const result = await handleReaction(post, userId, "like");

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Increment post dislike count
// @route   POST /api/posts/:id/dislike
// @access  Private (member)
const dislikePost = async (req, res) => {
    try {
        const userId = req.user._id;

        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        const result = await handleReaction(post, userId, "dislike");

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Increment post view count
// @route   POST /api/posts/:id/view
// @access  Public
const incrementView = async (req, res) => {
    try {
        const post = await incrementPostView(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado",
            });
        }

        res.json({
            views: post.views,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error",
            error: error.message,
        });
    }
};

module.exports = { 
    likePost, 
    dislikePost, 
    incrementView 
};