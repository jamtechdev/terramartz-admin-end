/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

type RoleType =
  | "Super Admin"
  | "Ops"
  | "Finance"
  | "Logistics"
  | "Support"
  | "Read-Only";

export type PermissionLevel = "No" | "View" | "Full";

export type PermissionModule =
  | "Dashboard"
  | "Orders"
  | "Vendors"
  | "Products"
  | "Users"
  | "Payments"
  | "Payouts"
  | "Logistics"
  | "Support"
  | "Marketing"
  | "Settings"
  | "Blogs"
  | "Promo Codes";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number | string;
  role: RoleType;
  isActive: boolean;
  permissions: Record<PermissionModule, PermissionLevel>;
};

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  hasPermission: (
    module: PermissionModule,
    accessLevel?: "View" | "Full",
  ) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD AUTH FROM STORAGE
  // =========================
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await authService.getAdminMe(storedToken);
        if (response?.status === "success" && response?.data?.user) {
          const freshUser = response.data.user as User;
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } else {
          throw new Error("Invalid profile response");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = (authToken: string, userData: User) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const hasPermission = (
    module: PermissionModule,
    accessLevel: "View" | "Full" = "View",
  ): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    const currentAccess = user.permissions[module];
    if (!currentAccess || currentAccess === "No") {
      return false;
    }
    const result =
      accessLevel === "View"
        ? currentAccess === "View" || currentAccess === "Full"
        : currentAccess === "Full";

    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        token,
        user,
        login,
        logout,
        loading,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
