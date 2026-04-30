const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const User = require("../models/User");
const SavedPost = require("../models/SavedPost");
const Feedback = require("../models/Feedback");

const { getGlobalModerationStats, getUserModerationSummary } = require("../services/moderation.service");

const getAdminDashboard = async () => {
    const [
        totalPosts,
        drafts,
        published,
        totalComments,
        aiGenerated,
        unreadFeedbacks,
        recentFeedbacks
    ] = await Promise.all([
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: true }),
        BlogPost.countDocuments({ isDraft: false }),
        Comment.countDocuments(),
        BlogPost.countDocuments({ generatedByAI: true }),
        Feedback.countDocuments({ status: "pending" }),
        Feedback.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("sender", "username name profileImageUrl")
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
            aiGenerated,
            unreadFeedbacks
        },
        topPosts,
        recentComments,
        recentFeedbacks,
        tagUsage,
        moderation
    };
};

const getSuperAdminDashboard = async () => {
    const [
        totalUsers,
        verifiedUsers,
        unVerifiedUsers,
        admins,
        unreadFeedbacks
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isVerified: true }),
        User.countDocuments({ isVerified: false }),
        User.countDocuments({ role: "admin" }),
        Feedback.countDocuments({ status: "pending" })
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
            admins,
            unreadFeedbacks
        },
        tagUsage,
        moderation
    };
};

const getMemberDashboard = async (userId) => {
    const [
        savedPostCount,
        myComments,
        moderation,
        myFeedbacks,
        myRespondedFeedbacks
    ] = await Promise.all([
        SavedPost.countDocuments({ user: userId }),
        Comment.countDocuments({ author: userId }),
        getUserModerationSummary(userId),
        Feedback.countDocuments({ sender: userId }),
        Feedback.countDocuments({ sender: userId, status: "responded" })
    ]);

    const recentSaved = await SavedPost.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
            path: "post",
            select: "title slug coverImageUrl"
        });

    const recentFeedbacks = await Feedback.find({ sender: userId })
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        type: "member",
        stats: {
            savedPostCount,
            myComments,
            myFeedbacks,
            myRespondedFeedbacks
        },
        moderation,
        recentSaved,
        recentFeedbacks
    };
};

module.exports = {
    getAdminDashboard,
    getSuperAdminDashboard,
    getMemberDashboard
};