import StaffList from "@/app/components/admin/staffs/StaffList";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function StaffsPage() {
  return (
    <div>
      <DashboardHeader title="Staff Management" />
      <StaffList />
    </div>
  );
}
