import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    _id: string;
    allComplaints: number;
    pending: number;
    completed: number;
    rejected: number;
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
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="allComplaints" fill="#8884d8" /> */}
            <Bar dataKey="pending" fill="#8884d8" /> 
            <Bar dataKey="completed" fill="#82ca9d" />
            <Bar dataKey="rejected" fill="#ff7c7c" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart; 