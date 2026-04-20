const BlogPost = require("../../models/BlogPost");

// @desc    Create a new blog post
// @route   Post /api/posts
// @access  Private (Admin Only)
const createPost = async (req, res) => {
    try {
        const { title, content, coverImageUrl, tags, isDraft, generatedByAI } = req.body;

        const slug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const newPost = new BlogPost({
            title,
            slug,
            content,
            coverImageUrl,
            tags,
            author: req.user._id,
            isDraft,
            generatedByAI,
        });

        await newPost.save();
        res.status(201).json(newPost);
        
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el post",
            error: error.message,
        });
    }
};

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {

};

// @desc    Deslete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin)
const deletePost = async (req, res) => {

};

// @desc    Get Blog posts by status (all, published, or draft) and include counts
// @route   GET /api/posts?status=published|draft|all&page=1
// @access  Public
const getAllPosts = async (req, res) => {

};

// @desc    Get a single blog post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {

};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
};