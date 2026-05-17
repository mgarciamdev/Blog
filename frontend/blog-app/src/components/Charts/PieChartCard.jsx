import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import PieChartTooltip from './PieChartTooltip';
import PieChartLegend from './PieChartLegend';

const PieChartCard = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          name="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>

        <Tooltip content={<PieChartTooltip />}/>

        <Legend content={<PieChartLegend />} />

      </PieChart>
    </ResponsiveContainer>
  )
}

export default PieChartCard;