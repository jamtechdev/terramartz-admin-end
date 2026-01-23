"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const orderStatusData = [
  { month: "Jan", completed: 320, pending: 90, cancelled: 30 },
  { month: "Feb", completed: 300, pending: 110, cancelled: 40 },
  { month: "Mar", completed: 360, pending: 100, cancelled: 35 },
  { month: "Apr", completed: 420, pending: 95, cancelled: 25 },
  { month: "May", completed: 480, pending: 85, cancelled: 20 },
  { month: "Jun", completed: 530, pending: 70, cancelled: 15 },
];

export default function OrderStatusAreaChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={orderStatusData}>
          <defs>
            <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="pending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="cancelled" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 6" stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke="#22c55e"
            fill="url(#completed)"
          />
          <Area
            type="monotone"
            dataKey="pending"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#pending)"
          />
          <Area
            type="monotone"
            dataKey="cancelled"
            stackId="1"
            stroke="#ef4444"
            fill="url(#cancelled)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
