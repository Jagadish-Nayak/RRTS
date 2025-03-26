import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    pincode: string;
    'Total Complaints': number;
    'Completed': number;
    'Rejected': number;
  }[];
  title?: string;
}

const BarChart = ({ data, title }: BarChartProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-700">{title}</h3>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pincode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Total Complaints" fill="#8884d8" />
            <Bar dataKey="Completed" fill="#82ca9d" />
            <Bar dataKey="Rejected" fill="#ff7c7c" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart; 