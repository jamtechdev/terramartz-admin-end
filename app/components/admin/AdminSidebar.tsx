"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  RiFolderLine,
  RiExchangeDollarLine,
} from "react-icons/ri";
import Image from "next/image";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <RiHomeLine size={20} /> },
    { name: "Users", href: "/admin/users", icon: <RiUserLine size={20} /> },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <RiFolderLine size={20} />,
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: <RiExchangeDollarLine size={20} />,
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
        collapsed ? "w-20" : "w-70"
      } transition-all duration-300 h-screen`}
    >
      <div
        className={`flex items-start mb-6 ${collapsed ? "justify-center" : ""}`}
      >
        {/* Logo */}
        {!collapsed && (
          <div className="text-left flex-1 flex items-center gap-2">
            <div className="relative w-[60px] h-[60px]">
              <Image
                src="/images/terramartz-logo.png"
                alt="Terramartz Logo"
                fill
                priority
                sizes="(max-width: 768px) 140px, 180px"
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">TerraMartz</h2>
              <p className="text-green-100 text-sm">Admin Panel</p>
            </div>
          </div>
        )}
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-center p-2 hover:bg-green-700 rounded cursor-pointer"
        >
          <RiMenuLine size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/admin");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 text-lg rounded-lg hover:bg-green-700 transition-colors ${
                collapsed ? "justify-center p-3 text-xl" : "px-4 py-3"
              }
             ${
               isActive
                 ? "bg-green-700 text-white"
                 : "text-green-100 hover:bg-green-700/60"
             }  
            `}
            >
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
        className={`flex items-center gap-3 text-lg rounded-lg bg-red-500 cursor-pointer text-white transition-colors ${
          collapsed ? "justify-center p-3 text-xl" : "px-4 py-3"
        }`}
      >
        <RiLogoutBoxRLine size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
