"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import {
  RiHomeLine,
  RiUserLine,
  RiSettings3Line,
  RiBarChartLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiFolderLine,
  RiExchangeDollarLine,
  RiTicketLine,
  RiCloseLine,
} from "react-icons/ri";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export default function AdminSidebar({ mobileOpen, setMobileOpen }: Props) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <RiHomeLine size={20} /> },
    { name: "Users", href: "/admin/users", icon: <RiUserLine size={20} /> },
    { name: "Categories", href: "/admin/categories", icon: <RiFolderLine size={20} /> },
    { name: "Transactions", href: "/admin/transactions", icon: <RiExchangeDollarLine size={20} /> },
    { name: "Tickets", href: "/admin/tickets", icon: <RiTicketLine size={20} /> },
    { name: "Reports", href: "/admin/reports", icon: <RiBarChartLine size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <RiSettings3Line size={20} /> },
  ];

  const SidebarContent = (
    <aside
      className={`flex flex-col bg-[linear-gradient(rgb(0_130_54),rgb(0_130_54_/_70%)),url('/images/inner-bg.png')] bg-cover bg-center bg-no-repeat text-white p-4
      ${collapsed ? "w-20" : "w-72"} h-full transition-all`}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1">
            <Image
              src="/images/terramartz-logo.png"
              alt="Logo"
              width={50}
              height={50}
            />
            <div>
              <h2 className="text-lg font-bold">TerraMartz</h2>
              <p className="text-sm">Admin Panel</p>
            </div>
          </div>
        )}

        {/* Desktop collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 hover:bg-green-700 rounded"
        >
          <RiMenuLine size={22} />
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-green-700 rounded"
        >
          <RiCloseLine size={22} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/admin");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg transition
              ${collapsed ? "justify-center p-3" : "px-4 py-3"}
              ${active ? "bg-green-900 text-white" : "text-green-100 hover:bg-green-900"}`}
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
        className={`flex items-center gap-3 cursor-pointer rounded-lg bg-red-500 mt-4
        ${collapsed ? "justify-center p-3" : "px-4 py-3"}`}
      >
        <RiLogoutBoxRLine size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block h-screen">{SidebarContent}</div>

      {/* Mobile */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            {SidebarContent}
          </div>
        </>
      )}
    </>
  );
}
