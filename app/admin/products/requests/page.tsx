"use client";
import ProductRequests from "@/app/components/admin/products/ProductRequests";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function ProductRequestsPage() {
  return (
    <div>
      <DashboardHeader title="Product Approval Requests" />
      <ProductRequests />
    </div>
  );
}