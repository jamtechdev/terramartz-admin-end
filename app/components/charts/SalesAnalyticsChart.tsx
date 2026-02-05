"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type MonthlyRevenue = {
  revenue: number;
  month: string;
};

interface SalesAnalyticsProps {
  data: MonthlyRevenue[];
}

const defaultData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 46000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 68000 },
];

export default function SalesAnalytics({ data = defaultData }: SalesAnalyticsProps) {
  return (
    <>
       <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              tickFormatter={(v) => `$${v / 1000}k`}
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
