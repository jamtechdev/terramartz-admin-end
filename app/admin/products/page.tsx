import ProductList from "@/app/components/admin/products/ProductList";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function ProductsPage() {
  return (
    <div>
      <DashboardHeader title="Products Management" />
      <ProductList />
    </div>
  );
}