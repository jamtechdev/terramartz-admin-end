import UserList from "@/app/components/admin/users/UserList";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function UsersPage() {
  return (
    <div>
      <DashboardHeader title="User Management" />
       <UserList />
    </div>
  );
}
