"use client";

import { useState } from "react";
import AuthGuard from "../components/auth/AuthGuard";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 flex flex-col w-full">
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />

          <div className="p-6 h-[calc(100vh-83px)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
