import React from 'react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
} from "recharts";

const COLORS = [
    "#10b981",
    "#34d399",
    "#6ee7b7",
    "#059669",
];

const EngagementChart = ({ data }) => {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <XAxis
                        dataKey="name"
                        tick={{
                            fill: "#6b7280",
                            fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{
                            fill: "#9ca3af",
                            fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        cursor={{
                            fill: "rgba(16,185,129,0.06)",
                        }}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #d1fae5",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)"
                        }}
                    />

                    <Bar
                        dataKey="value"
                        radius={[10, 10, 0, 0]}
                        animationDuration={1200}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EngagementChart;