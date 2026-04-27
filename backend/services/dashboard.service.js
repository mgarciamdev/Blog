const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const User = require("../models/User");
const SavedPost = require("../models/SavedPost");

const { getGlobalModerationStats, getUserModerationSummary } = require("../services/moderation.service");

const getAdminDashboard = async () => {
    const [
        totalPosts,
        drafts,
        published,
        totalComments,
        aiGenerated
    ] = await Promise.all([
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: true }),
        BlogPost.countDocuments({ isDraft: false }),
        Comment.countDocuments(),
        BlogPost.countDocuments({ generatedByAI: true })
    ]);

    const moderation = await getGlobalModerationStats();

    const [viewsAgg, likesAgg, dislikesAgg] = await Promise.all([
        BlogPost.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        BlogPost.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]),
        BlogPost.aggregate([{ $group: { _id: null, total: { $sum: "$dislikes" } } }]),
    ]);

    const totalViews = viewsAgg[0]?.total || 0;
    const totalLikes = likesAgg[0]?.total || 0;
    const totalDislikes = dislikesAgg[0]?.total || 0;

    const topPosts = await BlogPost.find({ isDraft: false })
        .select("title coverImageUrl views likes")
        .sort({ views: -1, likes: -1 })
        .limit(5);

    const recentComments = await Comment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "name profileImageUrl")
        .populate("post", "title coverImageUrl");

    const tagUsage = await BlogPost.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $project: { tag: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } }
    ]);

    return {
        type: "admin",
        stats: {
            totalPosts,
            drafts,
            published,
            totalViews,
            totalLikes,
            totalDislikes,
            totalComments,
            aiGenerated
        },
        topPosts,
        recentComments,
        tagUsage,
        moderation
    };
};

const getSuperAdminDashboard = async () => {
    const [
        totalUsers,
        verifiedUsers,
        unVerifiedUsers,
        admins
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isVerified: true }),
        User.countDocuments({ isVerified: false }),
        User.countDocuments({ role: "admin" })
    ]);

    const moderation = await getGlobalModerationStats();

    const tagUsage = await BlogPost.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $project: { tag: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } }
    ]);

    return {
        type: "superadmin",
        stats: {
            totalUsers,
            verifiedUsers,
            unVerifiedUsers,
            admins
        },
        tagUsage,
        moderation
    };
};

const getMemberDashboard = async (userId) => {
    const [
        savedPostCount,
        myComments,
        moderation
    ] = await Promise.all([
        SavedPost.countDocuments({ user: userId }),
        Comment.countDocuments({ author: userId }),
        getUserModerationSummary(userId)
    ]);

    const recentSaved = await SavedPost.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
            path: "post",
            select: "title slug coverImageUrl"
        });

    return {
        type: "member",
        stats: {
            savedPostCount,
            myComments
        },
        moderation,
        recentSaved
    };
};

module.exports = {
    getAdminDashboard,
    getSuperAdminDashboard,
    getMemberDashboard
};