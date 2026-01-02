"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import InventoryReport from "@/app/components/reports/InventoryReport";
import SalesReport from "@/app/components/reports/SalesReport";

export default function ReportsPage() {
  const dummySales = { totalRevenue: 4500, totalOrders: 120 };
  const dummyInventory = { totalProducts: 32, lowStockItems: 5 };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Reports"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SalesReport
          totalRevenue={dummySales.totalRevenue}
          totalOrders={dummySales.totalOrders}
        />
        <InventoryReport
          totalProducts={dummyInventory.totalProducts}
          lowStockItems={dummyInventory.lowStockItems}
        />
      </div>
    </div>
  );
}
