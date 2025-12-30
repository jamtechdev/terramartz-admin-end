import UserList from "@/app/components/admin/users/UserList";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserList />
    </div>
  );
}
