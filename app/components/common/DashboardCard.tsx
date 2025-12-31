import React from "react";

type DashboardCardProps = {
  children: React.ReactNode;
};

export default function DashboardCard({ children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {children}
    </div>
  );
}
