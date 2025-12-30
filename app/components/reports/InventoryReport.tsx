"use client";

type InventoryReportProps = {
  lowStockItems: number;
  totalProducts: number;
};

export default function InventoryReport({ lowStockItems, totalProducts }: InventoryReportProps) {
  return (
    <div className="bg-green-100 rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-green-700">Inventory Report</h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          Total Products: <strong>{totalProducts}</strong>
        </p>
        <p className="text-gray-700">
          Low Stock Items: <strong>{lowStockItems}</strong>
        </p>
      </div>
    </div>
  );
}
