import React from 'react'
import TagInsights from '../components/TagInsights';
import TopPostSection from './TopPostSection';
import EngagementSection from './EngagementSection';
import VerificationSection from './verificationSection';
import RoleDistributionSection from './RoleDistributionSection';
import RecentCommentListSection from './RecentCommentListSection';

const AdminInsightsSection = ({ tagUsage, topPosts, stats, comments, loading }) => {

    const hasTopPosts = topPosts?.length > 0;

    const hasEngagement =
        stats?.totalViews > 0 ||
        stats?.totalLikes > 0 ||
        stats?.totalComments > 0 ||
        stats?.totalDislikes > 0;

    const hasComments =
        comments?.length > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Tag Insights
                    </h3>
                </div>

                <TagInsights tagUsage={tagUsage} loading={loading}/>
            </div>

            {(hasTopPosts || loading) && (
                <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Top Posts
                        </h3>
                    </div>

                    <TopPostSection posts={topPosts} loading={loading} />
                </div>
            )}

            {(hasComments || loading) && (
                <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Recent Comments
                        </h3>
                    </div>

                    <RecentCommentListSection comments={comments} loading={loading} />
                </div>
            )}

            {(hasEngagement || loading) && (
                <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Engagement
                        </h3>
                    </div>

                    <EngagementSection stats={stats} loading={loading} />
                </div>
            )}
        </div>
    );
};

export default AdminInsightsSection;