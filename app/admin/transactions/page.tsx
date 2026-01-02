import TransactionList from "@/app/components/admin/transactions/TransactionList";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function TransactionPage() {
  return (
    <div>
      <DashboardHeader title="Transaction Management" />
        <TransactionList />
    </div>
  );
}
