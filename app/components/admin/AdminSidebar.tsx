"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

// Import Remix Icons from react-icons
import {
  RiHomeLine,
  RiUserLine,
  RiSettings3Line,
  RiBarChartLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiFolderLine 
} from "react-icons/ri";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
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

  return (
    <aside
      className={`flex flex-col bg-gradient-to-b from-green-800 to-green-900 text-white p-4  ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 min-h-screen`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-end mb-6 p-2 hover:bg-green-700 rounded cursor-pointer"
      >
        <RiMenuLine size={24} />
      </button>

      {/* Logo */}
      {!collapsed && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-green-200">TerraMartz</h2>
          <p className="text-green-300 text-sm mt-1">Admin Panel</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-700 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.replace("/");
        }}
        className={`mt-6 flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <RiLogoutBoxRLine size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
