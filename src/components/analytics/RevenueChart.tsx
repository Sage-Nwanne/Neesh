import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const RevenueChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Revenue']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};