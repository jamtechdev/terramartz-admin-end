import UserList from "@/app/components/admin/users/UserList";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function UsersPage() {
  return (
    <div>
      <DashboardHeader title="User Management" />
     <div className="mt-6">
       <UserList />
     </div>
    </div>
  );
}
