import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface TaskSeverityChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  title?: string;
}

export function TaskSeverityChart({ data, title }: TaskSeverityChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md text-gray-700 w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        {title && <h1 className="text-lg font-semibold text-gray-700">{title}</h1>}
      </div>
      {/* CHART */}
      <div className="relative w-full h-[70%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar background dataKey="value" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-8">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.fill }} />
            <h1 className="font-bold">{item.value}</h1>
            <h2 className="text-xs text-gray-400">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
