"use client";

import { RiArchiveLine, RiAlertLine } from "react-icons/ri";

type InventoryReportProps = {
  lowStockItems: number;
  totalProducts: number;
};

export default function InventoryReport({
  lowStockItems,
  totalProducts,
}: InventoryReportProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      {/* Glow Orbs */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-wide">
          Inventory Report
        </h2>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-md">
          Live Stock
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {/* Total Products */}
        <div className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <RiArchiveLine size={22} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Products</p>
              <p className="text-2xl font-bold tracking-tight">
                {totalProducts}
              </p>
            </div>
          </div>
          <span className="text-sm text-green-300">+5%</span>
        </div>

        {/* Low Stock */}
        <div className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <RiAlertLine size={22} />
            </div>
            <div>
              <p className="text-sm opacity-80">Low Stock Items</p>
              <p className="text-2xl font-bold tracking-tight text-white">
                {lowStockItems}
              </p>
            </div>
          </div>
          <span className="text-sm text-white">Attention</span>
        </div>
      </div>
    </div>
  );
}
