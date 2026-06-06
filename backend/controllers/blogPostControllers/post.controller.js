const BlogPost = require("../../models/BlogPost");
const SavedPost = require("../../models/SavedPost");
const { generateUniqueSlug } = require("../../services/post.service");

// @desc    Create a new blog post
// @route   Post /api/posts
// @access  Private (Admin Only)
const createPost = async (req, res) => {
    try {
        const { title, content, coverImageUrl, tags, isDraft, generatedByAI } = req.body;

        // Validamos
        if (!title || !content) {
            return res.status(400).json({
                message: "Título y contenido son obligatorios",
            });
        }

        // Generamos slug único
        const slug = await generateUniqueSlug(title);

        // Crear post
        const newPost = await BlogPost.create({
            title: title.trim(),
            slug,
            content,
            coverImageUrl: coverImageUrl || null,
            tags: Array.isArray(tags) ? tags : [],
            author: req.user._id,
            isDraft: isDraft ?? false,
            generatedByAI: generatedByAI ?? false,
        });

        // Response limpio
        res.status(201).json({
            message: "Post creado correctamente",
            post: {
                id: newPost._id,
                title: newPost.title,
                slug: newPost.slug,
                coverImageUrl: newPost.coverImageUrl,
                tags: newPost.tags,
                isDraft: newPost.generatedByAI,
                createdAt: newPost.createdAt,
            },
        });

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
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado",
            });
        }

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = ["admin", "superadmin"].includes(req.user.role);

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Sin autorización para actualizar este post"
            });
        }

        const allowedFields = [
            "title",
            "content",
            "coverImageUrl",
            "tags",
            "isDraft",
        ];

        let updateData = {};

        for (let field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        // Sanitizar title
        if (updateData.title) {
            updateData.title = updateData.title.trim();

            // Generamos el slug nuevo unicamente si el titulo cambia
            if (updateData.title !== post.title) {
                updateData.slug = await generateUniqueSlug(
                    updateData.title,
                    req.params.id
                );
            }
        }

        // Validar tags
        if (updateData.tags && !Array.isArray(updateData.tags)) {
            return res.status(400).json({
                message: "Tags debe ser un array",
            });
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            message: "Post actualizado",
            post: {
                id: updatedPost._id,
                title: updatedPost.title,
                slug: updatedPost.slug,
                coverImageUrl: updatedPost.coverImageUrl,
                tags: updatedPost.tags,
                isDraft: updatedPost.isDraft,
                updatedAt: updatedPost.updatedAt,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el post",
            error: error.message,
        });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin)
const deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = ["admin", "superadmin"].includes(req.user.role);

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Sin autorización para eliminar este post"
            });
        }

        await post.deleteOne();

        res.json({
            message: "Post eliminado exitosamente",
            post: {
                id: post._id,
                title: post.title,
                slug: post.slug,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el post"
        });
    }
};

// @desc    Get Blog posts by status (all, published, or draft cambiar a español despues) and include counts
// @route   GET /api/posts?status=published|draft|all&page=1
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        const { status = "published",
            page = 1,
            limit = 10,
            search,
            tag
        } = req.query;

        const parsedLimit = parseInt(limit);

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Number.isNaN(parsedLimit)
            ? 10
            : Math.min(50, parsedLimit);
        const skip = (pageNumber - 1) * limitNumber;

        // Filtro base
        let filter = {};

        if (status === "published") {
            filter.isDraft = false;
        } else {
            if (status === "draft") {
                filter.isDraft = true;
            }
        }
        // "all" -> no filtra

        // Busqueda
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        // Filtro por tag
        if (tag) {
            filter.tags = { $in: [tag] };
        }

        // Obtener posts
        const posts = await BlogPost.find(filter)
            .populate("author", "name profileImageUrl")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        // Conteos
        const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
            BlogPost.countDocuments(filter),
            BlogPost.countDocuments(),
            BlogPost.countDocuments({ isDraft: false }),
            BlogPost.countDocuments({ isDraft: true }),
        ]);

        // Formatear respuesta
        const formattedPosts = posts.map(post => ({
            id: post._id,
            title: post.title,
            slug: post.slug,
            coverImageUrl: post.coverImageUrl,
            tags: post.tags,
            author: post.author,
            isDraft: post.isDraft,
            views: post.views,
            likes: post.likes,
            dislikes: post.dislikes,
            generatedByAI: post.generatedByAI,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));

        res.json({
            posts: formattedPosts,
            pagination: {
                total: totalCount,
                page: pageNumber,
                pages: Math.ceil(totalCount / limitNumber),
                limit: limitNumber,
            },
            counts: {
                all: allCount,
                published: publishedCount,
                draft: draftCount,
            },
            filters: {
                status: status || null,
                search: search || null,
                tag: tag || null,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener todos los Posts",
            error: error.message,
        });
    }
};

// @desc    Get a single blog post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug })
            .populate("author", "name profileImageUrl");

        if (!post) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        let likedByUser = false;
        let dislikedByUser = false;
        let savedByUser = false;

        if (req.user) {
            const userId = req.user._id;

            likedByUser = post.likedBy.some(
                id => id.toString() === userId.toString()
            );

            dislikedByUser = post.dislikedBy.some(
                id => id.toString() === userId.toString()
            );

            // verifica si el post esta en savedPost
            const saved = await SavedPost.findOne({
                user: userId,
                post: post._id
            });

            savedByUser = !!saved;
        }

        res.json({
            post: {
                id: post._id,
                title: post.title,
                slug: post.slug,
                content: post.content,
                coverImageUrl: post.coverImageUrl,
                tags: post.tags,
                author: post.author,
                views: post.views,
                createdAt: post.createdAt,
            },
            interactions: {
                likes: post.likes,
                dislikes: post.dislikes,
                likedByUser,
                dislikedByUser,
                savedByUser,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los post por slug",
            error: error.message,
        });
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug,
};