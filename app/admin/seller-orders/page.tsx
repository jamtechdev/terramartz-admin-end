"use client";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import SellerOrderTable from "@/app/components/admin/seller-orders/SellerOrderTable";

export default function SellerOrdersPage() {
    return (
        <div className="space-y-6">
            <DashboardHeader title="Seller-wise Orders" />
            <SellerOrderTable />
        </div>
    );
}
