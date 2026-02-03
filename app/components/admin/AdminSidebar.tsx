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
  RiShieldCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { FaUsersGear } from "react-icons/fa6";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export default function AdminSidebar({ mobileOpen, setMobileOpen }: Props) {
  const { logout, user, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <RiHomeLine size={20} />,
      requiredModule: "Dashboard",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <RiUserLine size={20} />,
      requiredModule: "Users",
    },
    {
      name: "Staffs",
      href: "/admin/staffs",
      icon: <FaUsersGear size={20} />,
      superAdminOnly: true, // ✅ Only Super Admin can see this
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <RiFolderLine size={20} />,
      requiredModule: "Products", // Assuming categories fall under Products
    },
    {
      name: "KYC Management",
      href: "/admin/kyc",
      icon: <RiShieldCheckLine size={20} />,
      requiredModule: "Users",
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: <RiExchangeDollarLine size={20} />,
      requiredModule: "Payments",
    },
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: <RiTicketLine size={20} />,
      requiredModule: "Support",
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <RiBarChartLine size={20} />,
      requiredModule: "Dashboard",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <RiSettings3Line size={20} />,
      requiredModule: "Settings",
    },
  ];

  // ✅ Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // If it's super admin only, check role
    if (item.superAdminOnly) {
      return user?.role === "Super Admin";
    }

    // Otherwise check module permission
    if (item.requiredModule) {
      return hasPermission(item.requiredModule, "View");
    }

    return true;
  });

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

      {/* ✅ User Info Section */}
      {!collapsed && user && (
        <div className="mb-4 p-3 bg-green-800/50 rounded-lg border border-green-600/30">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <p className="text-xs text-green-200 truncate">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-xs rounded">
            {user.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

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
        className={`flex items-center gap-3 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 transition mt-4
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
