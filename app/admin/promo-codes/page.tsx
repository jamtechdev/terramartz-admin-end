import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import PromoCodeList from "@/app/components/admin/promo-codes/PromoCodeList";

export default function PromoCodesPage() {
  return (
    <div>
      <DashboardHeader title="Promo Code Management" />
      <PromoCodeList />
    </div>
  );
}
