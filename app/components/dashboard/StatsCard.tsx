"use client";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  Color?: string; // Tailwind border color class
};

export default function StatsCard({
  title,
  value,
  icon,
  Color,
}: StatsCardProps) {
  return (
    <div
      className={`relative flex items-center gap-4 p-5 bg-white rounded-xl border-l-4 border-${Color}
      shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {icon && (
        <div className={`flex items-center justify-center w-14 h-14 rounded-lg bg-${Color} text-gray-700`}>
          {icon}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
