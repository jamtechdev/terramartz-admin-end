"use client";

import { useAuth } from "../../context/AuthContext";

interface PermissionGuardProps {
  children: React.ReactNode;
  module: string;
  accessLevel?: "View" | "Full";
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ 
  children, 
  module, 
  accessLevel = "View", 
  fallback 
}: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, accessLevel)) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You don't have permission to access this feature.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}