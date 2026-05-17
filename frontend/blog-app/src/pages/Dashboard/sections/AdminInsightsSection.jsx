import React from 'react'
import TagInsights from '../components/TagInsights';

const AdminInsightsSection = ({ tagUsage, topPosts }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                        Tag Insights
                    </h3>
                </div>

                <TagInsights tagUsage={tagUsage} />
            </div>
        </div>
    );
};

export default AdminInsightsSection;