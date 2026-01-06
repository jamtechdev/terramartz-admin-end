"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { authService } from "@/app/services/auth.service";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  if (loading) return;

  setError("");

  if (!email.trim()) {
    setError("Email is required");
    return;
  }

  if (!password.trim()) {
    setError("Password is required");
    return;
  }

  try {
    setLoading(true);

    const response = await authService.adminLogin({ email, password });

    if (response?.status !== "success") {
      setError("Unable to login");
      return;
    }

    const token = response?.token;
    if (!token) {
      setError("Invalid login response");
      return;
    }

    login(token);
    toast.success("You have been logged in successfully.");
    router.push("/admin");

  } catch (err: any) {
    const message =
      err?.response?.data?.message || "Invalid email or password";
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div
        className="flex flex-col justify-end lg:p-16 p-8 text-white relative
        bg-[url('/images/auth-bg.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />
        <div className="relative z-10">
          <h1 className="lg:text-5xl text-3xl font-bold mb-2">
            TerraMartz Admin Console
          </h1>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />

            {/* ✅ Custom error message */}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

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
                type="button"
                className="text-green-600 hover:underline"
                onClick={() => alert("Forgot password clicked")}
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
