import React from 'react'

const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        
        return (
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-xs font-semibold text-emerald-800 mb-1">{payload[0].payload.name}</p>
                <p className="text-sm text-gray-600">
                    Count: <span className="text-sm font-monospace text-green-950">{payload[0].value}</span>
                </p>
            </div>
        );

    };

    return null;
};

export default PieChartTooltip;