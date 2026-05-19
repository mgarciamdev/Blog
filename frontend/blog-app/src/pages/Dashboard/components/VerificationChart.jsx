import React from 'react'
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import PieChartLegend from '../../../components/Charts/PieChartLegend';

const COLORS = [
    "#10b981",
    "#f43f5e",
];

const VerificationChart = ({ data, totalUsers }) => {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={130}
                        paddingAngle={4}
                        animationDuration={1200}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #d1fae5",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        }}
                    />
                    <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-900 text-3xl font-bold"
                    >
                        {totalUsers}
                    </text>

                    <text
                        x="50%"
                        y="52%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-400 text-sm"
                    >
                        Total Users
                    </text>
                    <Legend content={<PieChartLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default VerificationChart