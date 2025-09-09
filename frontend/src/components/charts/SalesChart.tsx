import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SalesDataPoint {
  period: string;
  value: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
  height?: number;
  showGrid?: boolean;
  strokeColor?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  height = 200, 
  showGrid = true, 
  strokeColor = '#10B981' 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis 
          dataKey="period" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#666' }}
        />
        <YAxis hide />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: strokeColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
