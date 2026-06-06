import React from 'react'

const PieChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        
        return (
            <div className="bg-white shadow-lg rounded-xl px-3 p-2 border border-gray-200">
                <p className="text-xs font-semibold text-emerald-800">{payload[0].payload.name}</p>
                <p className="text-xs text-gray-600">
                    Count: <span className="text-sm font-monospace text-green-950">{payload[0].value}</span>
                </p>
            </div>
        );

    };

    return null;
};

export default PieChartTooltip;