"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    login(); // frontend demo login
    router.push("/admin");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div
        className="flex flex-col justify-end lg:p-16 p-8 text-white relative
  bg-[url('/images/auth-bg.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />
        <div className="relative z-10">
          <h1 className="lg:text-5xl text-3xl font-bold mb-2">TerraMartz Admin Console</h1>
          <p className="text-lg opacity-90 mb-6">
            Monitor operations, manage partners, and control inventory from one
            place.
          </p>

          <ul className="space-y-5 text-2xl">
            <li>✔ Secure role-based access</li>
            <li>✔ Real-time supply insights</li>
            <li>✔ Faster procurement workflows</li>
          </ul>
        </div>
      </div>

      <div className="flex lg:items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="relative w-[100px] h-[100px] mb-8">
            <Image
              src="/images/terramartz-logo.png"
              alt="Terramartz Logo"
              fill
              priority
              sizes="(max-width: 768px) 140px, 180px"
              className="object-contain"
            />
          </div>
          <h2 className="text-4xl font-semibold text-black mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Access your supply dashboard
          </p>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-black cursor-pointer">
                <input
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  type="checkbox"
                  className="h-4 w-4 accent-green-600"
                />
                Remember me
              </label>
              <button
                className="text-green-600 hover:underline"
                onClick={() => alert("Forgot password clicked")}
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
