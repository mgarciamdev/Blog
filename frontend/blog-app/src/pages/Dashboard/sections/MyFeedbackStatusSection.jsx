import React from 'react'
import FeedbackStatusCard from '../components/FeedbackStatusCard'
import { LuBadgeCheck, LuMessageCircleWarning, LuMessageSquareMore } from 'react-icons/lu'
import moment from 'moment';
import EmptyState from '../../../components/EmptyState';
import FeedbackStatusSkeleton from '../../../components/Loaders/dashboard/FeedbackStatusSkeleton';

const MyFeedbackStatusSection = ({ stats, feedbacks, loading }) => {

    const safeFeedbacks = feedbacks || [];

    const pendingCount = safeFeedbacks.filter(
        (item) => item.status === "pending"
    ).length;

    const respondedCount = safeFeedbacks.filter(
        (item) => item.status === "responded"
    ).length;

    const latestResponded = [...safeFeedbacks]
        .filter((item) => item.response?.respondedAt)
        .sort(
            (a, b) =>
                new Date(b.response.respondedAt) -
                new Date(a.response.respondedAt)
        )[0];

    const lastResponseTime = latestResponded?.response?.respondedAt;

    if (loading) {
        return <FeedbackStatusSkeleton />;
    }

    if (!feedbacks?.length) {
        return (
            <EmptyState
                icon={<LuMessageSquareMore />}
                title="No existen feedbacks todavía"
                description="Los feedbacks aparecerán aqui."
            />
        );
    }

    return (
        <>
            <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FeedbackStatusCard
                        title="Feedbacks"
                        value={stats?.myFeedbacks || 0}
                        icon={<LuMessageSquareMore />}
                        bgColor="bg-sky-100"
                        iconColor="text-sky-700"
                    />

                    <FeedbackStatusCard
                        title="Responded"
                        value={respondedCount || 0}
                        icon={<LuBadgeCheck />}
                        bgColor="bg-emerald-100"
                        iconColor="text-emerald-700"
                    />

                    <FeedbackStatusCard
                        title="Pending"
                        value={pendingCount || 0}
                        icon={<LuMessageCircleWarning />}
                        bgColor="bg-yellow-100"
                        iconColor="text-yellow-700"
                    />
                </div>
                <div>
                    {lastResponseTime && (
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                            <span className="text-sm text-gray-500">
                                Last response received {moment(lastResponseTime).fromNow()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyFeedbackStatusSection