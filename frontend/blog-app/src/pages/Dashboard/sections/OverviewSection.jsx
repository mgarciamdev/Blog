import React from 'react'
import { LuBell, LuBrain, LuBrainCircuit, LuChartLine, LuCheckCheck, LuCloud, LuDraftingCompass, LuHeart, LuHeartCrack, LuMail, LuMailCheck, LuNotepadText, LuPodcast, LuSave, LuUser } from 'react-icons/lu';
import SummaryCard from '../components/SummaryCard';
import OverviewSkeleton from '../../../components/Loaders/dashboard/OverviewSkeleton';

const OverviewSection = ({ stats, loading }) => {

    if (loading) {
        return <OverviewSkeleton cards={6} />;
    }

    const cards = [];

    //SUPERADMIN
    if (stats?.totalUsers !== undefined) {
        cards.push({
            label: "Total Users",
            value: stats.totalUsers,
            icon: <LuUser />,
            color: "text-sky-500",
            bgColor: "bg-sky-100/60",
        });
    }

    if (stats?.verifiedUsers !== undefined) {
        cards.push({
            label: "Verified Users",
            value: stats.verifiedUsers,
            icon: <LuUser />,
            color: "text-green-500",
            bgColor: "bg-green-100/60",
        });
    }

    if (stats?.unVerifiedUsers !== undefined) {
        cards.push({
            label: "unVerified Users",
            value: stats.unVerifiedUsers,
            icon: <LuUser />,
            color: "text-red-500",
            bgColor: "bg-red-100/60",
        });
    }

    if (stats?.admins !== undefined) {
        cards.push({
            label: "admins",
            value: stats.admins,
            icon: <LuUser />,
            color: "text-emerald-500",
            bgColor: "bg-emerald-100/60",
        });
    }

    if (stats?.unreadFeedbacks !== undefined) {
        cards.push({
            label: "unread Feedbacks",
            value: stats.unreadFeedbacks,
            icon: <LuBell />,
            color: "text-pink-700",
            bgColor: "bg-pink-300/60",
        });
    }

    //ADMIN
    if (stats?.totalPosts !== undefined) {
        cards.push({
            label: "Total Posts",
            value: stats.totalPosts,
            icon: <LuPodcast />,
            color: "text-yellow-500",
            bgColor: "bg-yellow-300/60",
        });
    }

    if (stats?.drafts !== undefined) {
        cards.push({
            label: "Total Drafts",
            value: stats.drafts,
            icon: <LuDraftingCompass />,
            color: "text-cyan-500",
            bgColor: "bg-cyan-300/60",
        });
    }

    if (stats?.published !== undefined) {
        cards.push({
            label: "Published",
            value: stats.published,
            icon: <LuCheckCheck />,
            color: "text-green-800",
            bgColor: "bg-green-300/60",
        });
    }

    if (stats?.totalViews !== undefined) {
        cards.push({
            label: "Total Views",
            value: stats.totalViews,
            icon: <LuChartLine />,
            color: "text-sky-500",
            bgColor: "bg-sky-300/60",
        });
    }

    if (stats?.totalLikes !== undefined) {
        cards.push({
            label: "Total Likes",
            value: stats.totalLikes,
            icon: <LuHeart />,
            color: "text-pink-500",
            bgColor: "bg-pink-300/60",
        });
    }

    if (stats?.totalDislikes !== undefined) {
        cards.push({
            label: "Total Dislikes",
            value: stats.totalDislikes,
            icon: <LuHeartCrack />,
            color: "text-red-500",
            bgColor: "bg-red-300/60",
        });
    }

    if (stats?.totalComments !== undefined) {
        cards.push({
            label: "Total Comments",
            value: stats.totalComments,
            icon: <LuCloud />,
            color: "text-gray-500",
            bgColor: "bg-gray-300/60",
        });
    }

    if (stats?.aiGenerated !== undefined) {
        cards.push({
            label: "AI Generated",
            value: stats.aiGenerated,
            icon: <LuBrainCircuit />,
            color: "text-purple-800",
            bgColor: "bg-purple-300/60",
        });
    }

    // Member
    if (stats?.savedPostCount !== undefined) {
        cards.push({
            label: "Saved Count",
            value: stats.savedPostCount,
            icon: <LuSave />,
            color: "text-gray-800",
            bgColor: "bg-gray-300/60",
        });
    }

    if (stats?.myComments !== undefined) {
        cards.push({
            label: "My Comments Count",
            value: stats.myComments,
            icon: <LuNotepadText />,
            color: "text-yellow-800",
            bgColor: "bg-yellow-300/60",
        });
    }

    if (stats?.myFeedbacks !== undefined) {
        cards.push({
            label: "Sended Feedback",
            value: stats.myFeedbacks,
            icon: <LuMail />,
            color: "text-blue-800",
            bgColor: "bg-blue-200/60",
        });
    }

    if (stats?.myRespondedFeedbacks !== undefined) {
        cards.push({
            label: "Responded Feedback",
            value: stats.myRespondedFeedbacks,
            icon: <LuMailCheck />,
            color: "text-green-800",
            bgColor: "bg-green-200/60",
        });
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {cards.map((card, index) => (
                    <SummaryCard
                        key={index}
                        icon={card.icon}
                        label={card.label}
                        value={card.value}
                        color={card.color}
                        bgColor={card.bgColor}
                    />
                ))}
            </div>
        </div>
    );
};

export default OverviewSection;