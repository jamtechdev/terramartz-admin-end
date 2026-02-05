/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type RoleType =
  | "Super Admin"
  | "Ops"
  | "Finance"
  | "Logistics"
  | "Support"
  | "Read-Only";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number | string;
  role: RoleType;
  isActive: boolean;
  permissions: {
    Dashboard: string;
    Orders: string;
    Vendors: string;
    Products: string;
    Users: string;
    Payments: string;
    Payouts: string;
    Logistics: string;
    Support: string;
    Marketing: string;
    Settings: string;
    Blogs: string;
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  hasPermission: (module: string, accessLevel?: "View" | "Full") => boolean;
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
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      console.log("✅ Token set in state");
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
    console.log("🏁 AuthContext: Loading complete");
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
    module: string,
    accessLevel: "View" | "Full" = "View",
  ): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    const currentAccess =
      user.permissions[module as keyof typeof user.permissions];
    const result =
      accessLevel === "View"
        ? currentAccess === "View" || currentAccess === "Full"
        : currentAccess === "Full";

    return result;
  };

  console.log("🔄 AuthContext render:", {
    token,
    user,
  });

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
