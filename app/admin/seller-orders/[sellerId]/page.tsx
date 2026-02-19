"use client";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import SellerSpecificOrderList from "@/app/components/admin/seller-orders/SellerSpecificOrderList";
import { useParams } from "next/navigation";

export default function SellerOrderDetailPage() {
    const params = useParams();
    const sellerId = params.sellerId as string;

    return (
        <div className="space-y-6">
            <DashboardHeader title="Seller Orders Details" />
            <SellerSpecificOrderList sellerId={sellerId} />
        </div>
    );
}
