import AuthGuard from "../components/auth/AuthGuard";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </AuthGuard>
  );
}
