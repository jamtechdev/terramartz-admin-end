"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/"); // ✅ Use replace instead of push
    }
  }, [isAuthenticated, loading, router]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col w-full">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        <div className="p-6 h-[calc(100vh-83px)] overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
