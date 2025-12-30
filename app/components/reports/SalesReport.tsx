"use client";

type SalesReportProps = {
  totalRevenue: number;
  totalOrders: number;
};

export default function SalesReport({ totalRevenue, totalOrders }: SalesReportProps) {
  return (
    <div className="bg-blue-100 rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Sales Report</h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          Total Orders: <strong>{totalOrders}</strong>
        </p>
        <p className="text-gray-700">
          Total Revenue: <strong>${totalRevenue}</strong>
        </p>
      </div>
    </div>
  );
}
