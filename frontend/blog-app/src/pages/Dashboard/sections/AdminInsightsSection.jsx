import React from 'react'
import TagInsights from '../components/TagInsights';
import TopPostSection from './TopPostSection';
import EngagementSection from './EngagementSection';
import VerificationSection from './verificationSection';
import RoleDistributionSection from './RoleDistributionSection';
import RecentCommentListSection from './RecentCommentListSection';

const AdminInsightsSection = ({ tagUsage, topPosts, stats, comments }) => {

    const hasTopPosts = topPosts?.length > 0;

    const hasEngagement =
        stats?.totalViews > 0 ||
        stats?.totalLikes > 0 ||
        stats?.totalComments > 0 ||
        stats?.totalDislikes > 0;

    const hasVerification =
        stats?.verifiedUsers > 0 ||
        stats?.unVerifiedUsers > 0;

    const hasRoles =
        stats?.superadmin > 0 ||
        stats?.admins > 0 ||
        stats?.members > 0 ||
        stats?.totalUsers > 0;

    const hasComments =
        comments?.length > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Tag Insights
                    </h3>
                </div>

                <TagInsights tagUsage={tagUsage} />
            </div>

            {hasTopPosts && (
                <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Top Posts
                        </h3>
                    </div>

                    <TopPostSection posts={topPosts} />
                </div>
            )}

            {hasComments && (
                <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Recent Comments
                        </h3>
                    </div>

                    <RecentCommentListSection comments={comments} />
                </div>
            )}

            {hasEngagement && (
                <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Engagement
                        </h3>
                    </div>

                    <EngagementSection stats={stats} />
                </div>
            )}

            {hasVerification && (
                <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            User Verification Status
                        </h3>
                    </div>

                    <VerificationSection stats={stats} />
                </div>
            )}

            {hasRoles && (
                <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Rol Distribution
                        </h3>
                    </div>

                    <RoleDistributionSection stats={stats} />
                </div>
            )}
        </div>
    );
};

export default AdminInsightsSection;