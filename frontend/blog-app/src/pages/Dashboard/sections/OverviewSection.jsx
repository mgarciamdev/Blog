import React from 'react'
import SummaryCard from '../components/SummaryCard';
import OverviewSkeleton from '../../../components/Loaders/dashboard/OverviewSkeleton';

import { buildOverviewCards } from '../../../utils/dashboardCards';

const OverviewSection = ({ stats, loading }) => {

    const cards = buildOverviewCards(stats);

    return (
        <>
            {loading ? (
                <OverviewSkeleton cards={6} />
            ) : (
                <div className="animate-fadeIn bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-5">
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
            )}
        </>
    );
};

export default OverviewSection;