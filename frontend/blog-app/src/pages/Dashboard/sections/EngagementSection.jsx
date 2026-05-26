import React from 'react'
import EngagementChart from '../components/EngagementChart';
import EmptyState from '../../../components/EmptyState';
import { LuChartColumn } from 'react-icons/lu';
import ChartSkeleton from '../../../components/Loaders/dashboard/ChartSkeleton';

const EngagementSection = ({ stats, loading }) => {
    const chartData = [
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

    const hasEngagementData = chartData.some(
        (item) => item.value > 0
    );

    if (loading) {
        return <ChartSkeleton />
    }

    if (!hasEngagementData) {
        return (
            <div className="min-h-80 flex items-center justify-center">
                <EmptyState
                    icon={<LuChartColumn />}
                    title="No hay datos de participacion"
                    description="Aquí aparecerán los análisis de interacción posteriores."
                />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn mt-4">
            <div className="col-span-12 md:col-span-7">
                <EngagementChart data={chartData} />
            </div>
        </div>
    );
};

export default EngagementSection;