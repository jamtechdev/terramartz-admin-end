"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 42000, orders: 320, profit: 12000 },
  { month: "Feb", revenue: 38000, orders: 290, profit: 10500 },
  { month: "Mar", revenue: 46000, orders: 350, profit: 14000 },
  { month: "Apr", revenue: 52000, orders: 410, profit: 18000 },
  { month: "May", revenue: 61000, orders: 480, profit: 22000 },
  { month: "Jun", revenue: 68000, orders: 530, profit: 26000 },
];

export default function SalesAnalytics() {
  return (
    <>
       <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesData}
            barSize={50}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />

            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
