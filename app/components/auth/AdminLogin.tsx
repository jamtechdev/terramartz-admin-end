"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    login(); // frontend demo login
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-200 to-yellow-100">
      {/* Login Form Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center">
          {/* Logo / Brand */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-green-700">
              TerraMartz Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">Supply Dashboard</p>
          </div>

          {/* Login Form */}
          <div className="w-full space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="hover:text-green-700 font-medium"
                onClick={() => alert("Forgot password clicked")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-3 rounded-lg font-semibold shadow"
            >
              Login
            </button>
          </div>

          {/* Footer / Extra */}
          <div className="mt-6 text-gray-400 text-sm text-center">
            Demo Login – No credentials needed
          </div>
        </div>
      </main>
    </div>
  );
}
