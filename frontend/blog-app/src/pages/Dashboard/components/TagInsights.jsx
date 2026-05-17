import React, { useMemo } from 'react';
import PieChartCard from '../../../components/Charts/PieChartCard';

const COLORS = [
    "#10b981",
    "#34d399",
    "#6ee7b7",
    "#059669",
    "#047857",
];

const TagCloud = ({ tags }) => {
    const maxCount = Math.max(...tags.map((tag) => tag.count), 1);

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
                const fontSize = 12 + (tag.count / maxCount) * 5;
                return (
                    <span
                        key={tag.name}
                        className="font-medium text-emerald-900/80 bg-emerald-100 px-3 py-0.5 rounded-lg"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        #{tag.name}
                    </span>
                );
            })}
        </div>
    );
}

const TagInsights = ({ tagUsage = [] }) => {
    const processedData = useMemo(() => {
        if (!tagUsage?.length) return [];

        const sorted = [...tagUsage].sort((a, b) => b.count - a.count);

        const topFour = sorted.slice(0, 4);
        const others = sorted.slice(4);

        const othersCount = others.reduce((sum, item) => sum + item.count, 0);

        const finalData = topFour.map((item) => ({
            ...item,
            name: item.tag || "",
        }));

        if (othersCount > 0) {
            finalData.push({
                name: "Others",
                count: othersCount,
            });
        }

        return finalData;

    }, [tagUsage]);

    return (
        <div className="grid grid-cols-12 mt-4">
            <div className="col-span-12 md:col-span-7">
                <PieChartCard data={processedData} colors={COLORS} />
            </div>

            <div className="col-span-12 md:col-span-5 mt-5 md:mt-0">
                <TagCloud
                    tags={
                        tagUsage.slice(0, 15).map((item) => ({
                            ...item,
                            name: item.tag || "",
                        })) || []
                    }
                />
            </div>
        </div>
    );
};

export default TagInsights;