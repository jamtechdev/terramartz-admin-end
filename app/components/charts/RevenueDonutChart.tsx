"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Marketing", value: 40 },
  { name: "Sales", value: 25 },
  { name: "Operations", value: 20 },
  { name: "Other", value: 15 },
];

const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#FB7185"];

export default function RevenueDonutChart() {
  const total = "$22.1k";

  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      <div className="relative w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-400">This Month</p>
        </div>
      </div>
    </div>
  );
}
