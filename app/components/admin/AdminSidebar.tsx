"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Image from "next/image";

// Remix Icons
import {
  RiHomeLine,
  RiUserLine,
  RiSettings3Line,
  RiBarChartLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiFolderLine,
} from "react-icons/ri";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <RiHomeLine size={20} /> },
    { name: "Users", href: "/admin/users", icon: <RiUserLine size={20} /> },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <RiFolderLine size={20} />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <RiSettings3Line size={20} />,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <RiBarChartLine size={20} />,
    },
  ];
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col bg-linear-to-b from-green-800 to-green-900 text-white p-4
      ${collapsed ? "w-20" : "w-70"}
      transition-all duration-300 h-screen`}
    >
      {/* Logo + Toggle */}
      <div
        className={`flex items-start mb-6 ${collapsed ? "justify-center" : ""}`}
      >
        {!collapsed && (
          <div className="text-left flex-1 flex items-center gap-2">
            <div className="relative w-15 h-15">
              <Image
                src="/images/terramartz-logo.png"
                alt="Terramartz Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">TerraMartz</h2>
              <p className="text-green-100 text-sm">Admin Panel</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-center p-2 hover:bg-green-700 rounded cursor-pointer"
        >
          <RiMenuLine size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg transition-all
                ${
                  active
                    ? "bg-green-700 text-white font-semibold"
                    : "text-green-100 hover:bg-green-700"
                }
                ${collapsed ? "justify-center p-3 text-xl" : "px-4 py-3"}
              `}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r"></span>
              )}

              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.replace("/");
        }}
        className={`flex items-center gap-3 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white
          ${collapsed ? "justify-center p-3 text-xl" : "px-4 py-3"}
        `}
      >
        <RiLogoutBoxRLine size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
