import React from 'react'
import RecentActivitySection from './RecentActivitySection';
import SavedPostSection from './SavedPostSection';
import MyFeedbackStatusSection from './MyFeedbackStatusSection';

const MemberInsightsSection = ({ saved, feedbacks, stats }) => {
    const hasActivity =
        saved?.length > 0 || feedbacks?.length > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">

            <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-mdshadow-gray-100 border border-gray-200/50 transition-all duration-200 hover:bg-emerald-50/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Latest Saved
                    </h3>
                </div>

                <SavedPostSection saved={saved} />
            </div>

            {hasActivity && (
                <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 transition-all duration-200 hover:bg-emerald-50/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Recent Activity
                        </h3>
                    </div>

                    <RecentActivitySection saved={saved} feedbacks={feedbacks} />
                </div>
            )}

            <div className="col-span-12 md:col-span-3 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 transition-all duration-200 hover:bg-emerald-50/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Feedback Status
                    </h3>
                </div>

                <MyFeedbackStatusSection stats={stats} feedbacks={feedbacks} />
            </div>
        </div>
    );
};

export default MemberInsightsSection;