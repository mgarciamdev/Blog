import React from 'react'
import EngagementChart from '../components/EngagementChart';

const EngagementSection = ({ stats }) => {
    const charData = [
        {
            name: "Views",
            value: stats?.totalViews || 0,
        },
        {
            name: "Likes",
            value: stats?.totalLikes || 0,
        },
        {
            name: "Comments",
            value: stats?.totalComments || 0,
        },
        {
            name: "Dislikes",
            value: stats?.totalDislikes || 0,
        },
    ];

    return (
        <div className="grid grid-cols-5 mt-4">
            <div className="col-span-12 md:col-span-7">
                <EngagementChart data={charData} />
            </div>
        </div>
    );
};

export default EngagementSection;