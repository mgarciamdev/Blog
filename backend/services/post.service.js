const BlogPost = require("../models/BlogPost");

/**
 *  Helper seguro para comparar ObjectId
 */
const hasUser = (arr, userId) =>
    arr.some(id => id.toString() === userId.toString());

/**
 * CORE LOGIC
 */
const handleReaction = async (post, userId, type) => {
    const liked = hasUser(post.likedBy, userId);
    const disliked = hasUser(post.dislikedBy, userId);

    if (type === "like") {
        if (liked) {
            post.likedBy.pull(userId);
        } else {
            post.likedBy.push(userId);

            if (disliked) {
                post.dislikedBy.pull(userId);
            }
        }
    }

    if (type === "dislike") {
        if (disliked) {
            post.dislikedBy.pull(userId);
        } else {
            post.dislikedBy.push(userId);

            if (liked) {
                post.likedBy.pull(userId);
            }
        }
    }

    // Recalculamos
    post.likes = post.likedBy.length;
    post.dislikes = post.dislikedBy.length;

    await post.save({ timestamps: false });

    return {
        likes: post.likes,
        dislikes: post.dislikes,
        likedByUser: hasUser(post.likedBy, userId),
        dislikedByUser: hasUser(post.dislikedBy, userId),
    };
};

const incrementPostView = async (postId) => {
    const post = await BlogPost.findByIdAndUpdate(
        postId,
        { $inc: { views: 1 } },
        { new: true, timestamps: false } // evitamos que updatedAt se modifique
    );

    return post;
};

const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

const generateUniqueSlug = async (title, postId = null) => {
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await BlogPost.findOne({ slug });

        if (!existing || existing._id.toString() === postId) {
            return slug;
        }

        slug = `${baseSlug}-${counter++}`;
    }
};

const formatAuthor = (author) => {
    if (author) return author;

    return {
        name: "Usuario eliminado",
        username: null,
        profileImageUrl: null,
    };
};

module.exports = {
    handleReaction,
    incrementPostView,
    generateUniqueSlug,
    formatAuthor
};