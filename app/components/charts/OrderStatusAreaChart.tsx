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

export type OrderStatus = {
  status: string;
  count: number;
};

export type OrderStat = {
  statuses: OrderStatus[];
  month: string;
};

export default function OrderStatusAreaChart({
  orderStats,
}: {
  orderStats?: OrderStat[];
}) {
  const defaultData = [
    { month: "Jan", completed: 320, pending: 90, cancelled: 30 },
    { month: "Feb", completed: 300, pending: 110, cancelled: 40 },
    { month: "Mar", completed: 360, pending: 100, cancelled: 35 },
    { month: "Apr", completed: 420, pending: 95, cancelled: 25 },
    { month: "May", completed: 480, pending: 85, cancelled: 20 },
    { month: "Jun", completed: 530, pending: 70, cancelled: 15 },
  ];

  const data =
    orderStats && orderStats.length > 0
      ? orderStats.map((stat) => ({
          month: stat.month,
          ...stat.statuses.reduce(
            (acc, s) => {
              acc[s.status] = s.count;
              return acc;
            },
            {} as Record<string, number>,
          ),
        }))
      : defaultData;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
            <linearGradient id="new" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="processing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="shipped" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
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
            dataKey="new"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#new)"
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
            dataKey="processing"
            stackId="1"
            stroke="#8b5cf6"
            fill="url(#processing)"
          />
          <Area
            type="monotone"
            dataKey="shipped"
            stackId="1"
            stroke="#06b6d4"
            fill="url(#shipped)"
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
