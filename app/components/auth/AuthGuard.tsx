"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import router from "next/router";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace("/"); // redirect only after loading
    }
  }, [loading, router]);

  // 🔹 Full-page dashboard-style spinner
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
          <p className="text-white text-lg font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Authorized users render children
  return <>{children}</>;
}
