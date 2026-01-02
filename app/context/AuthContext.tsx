/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAdmin: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD AUTH FROM STORAGE
  // =========================
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin") === "true";
    const storedToken = localStorage.getItem("token");

    setIsAdmin(storedAdmin);
    setToken(storedToken);
    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = (authToken: string) => {
    localStorage.setItem("admin", "true");
    localStorage.setItem("token", authToken);

    setIsAdmin(true);
    setToken(authToken);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");

    setIsAdmin(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// HOOK
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
