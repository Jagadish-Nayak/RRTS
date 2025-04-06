import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  total?: number;
  title?: string;
}

const DonutChart = ({ data, total, title }: DonutChartProps) => {
  //console.log(data);
  const num = total ? total : data.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium mb-2 text-gray-700">{title}</h3>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 mt-2 text-gray-700">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="text-xs font-medium">
              <div>{item.name}</div>
              <div>{Math.round((item.value/num)*100)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart; 