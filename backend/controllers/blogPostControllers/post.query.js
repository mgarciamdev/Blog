const BlogPost = require("../../models/BlogPost");
const { formatAuthor } = require("../../services/post.service");

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
const getPostByTag = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const tag = req.params.tag;

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        const filter = {
            tags: tag,
            isDraft: false,
        };

        const total = await BlogPost.countDocuments(filter);

        const posts = await BlogPost.find(filter)
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            posts: posts.map(p => ({
                id: p._id,
                title: p.title,
                slug: p.slug,
                coverImageUrl: p.coverImageUrl,
                tags: p.tags,
                author: formatAuthor(p.author),
                createdAt: p.createdAt,
            })),
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / limitNumber),
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "No se pudieron obtener los post por medio del tag",
            error: error.message
        });
    }
};

// @desc    Search posts by title or content
// @route   GET /api/posts/search?q=keyword
// @access  Public
const searchPosts = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Query de búsqueda requerido",
            });
        }

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        const filter = {
            isDraft: false,
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
            ],
        };

        const total = await BlogPost.countDocuments(filter);

        const posts = await BlogPost.find(filter)
            .populate("author", "name profileImageUrl")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            posts: posts.map(p => ({
                id: p._id,
                title: p.title,
                slug: p.slug,
                coverImageUrl: p.coverImageUrl,
                tags: p.tags,
                author: formatAuthor(p.author),
                createdAt: p.createdAt,
            })),
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / limitNumber),
            },
            query: q,
        });

    } catch (error) {
        res.status(500).json({
            message: "No se encontro el post",
            error: error.message
        });
    }
};

// @desc    Get top trending posts
// @route   GET /api/posts/trending
// @access  Private
const getTopPosts = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const limitNumber = Math.min(20, parseInt(limit) || 5);

        const posts = await BlogPost.find({
            isDraft: false,
            views: { $gt: 0 }
        })
            .populate("author", "name profileImageUrl")
            .sort({ views: -1, likes: -1, createdAt: -1 })
            .limit(limitNumber)
            .lean();

        res.json({
            posts: posts.map(p => ({
                id: p._id,
                title: p.title,
                slug: p.slug,
                coverImageUrl: p.coverImageUrl,
                author: formatAuthor(p.author),
                likes: p.likes,
                views: p.views,
            })),
        });

    } catch (error) {
        res.status(500).json({
            message: "No se obtuvieron los post destacados",
            error: error.message
        });
    }
};

module.exports = {
    getPostByTag,
    searchPosts,
    getTopPosts
};