"use client";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  bgColor?: string; // Tailwind bg class
};

export default function StatsCard({ title, value, icon, bgColor }: StatsCardProps) {
  return (
    <div className={`flex items-center p-4 rounded-xl shadow-lg ${bgColor || "bg-white"}`}>
      {icon && <div className="p-3 rounded-full bg-white/30 mr-4">{icon}</div>}
      <div className={icon ? "text-white" : ""}>
        <p className={`text-sm font-medium ${icon ? "text-white" : "text-gray-500"}`}>{title}</p>
        <p className={`text-2xl font-bold ${icon ? "text-white" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
