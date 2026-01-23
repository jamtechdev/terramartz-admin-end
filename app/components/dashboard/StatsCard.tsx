"use client";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  BorderColor?: string; 
   BgColor?: string; 
};

export default function StatsCard({
  title,
  value,
  icon,
  BorderColor,
  BgColor
}: StatsCardProps) {
  return (
    <div
      className={`relative flex items-center gap-4 p-5 bg-white rounded-xl border-l-4 ${BorderColor}
      shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {icon && (
        <div className={`flex items-center justify-center w-20 h-20 rounded-lg ${BgColor} text-gray-700`}>
          {icon}
        </div>
      )}

      <div>
        <p className="text-lg font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
