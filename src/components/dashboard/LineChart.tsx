import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: {
    month: string;
    Completed: number;
    Pending: number;
    Rejected: number;
  }[];
  title?: string;
}

const LineChart = ({ data, title }: LineChartProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-700">{title}</h3>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Completed" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="Pending" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="Rejected" stroke="#ff7c7c" strokeWidth={2} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart; 