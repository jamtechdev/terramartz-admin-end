"use client";

import { FaAppleAlt, FaDollarSign, FaUsers, FaBoxes } from "react-icons/fa";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import UserList from "../components/admin/users/UserList";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: 1523,
      icon: <FaBoxes size={20} className="text-white" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$45,300",
      icon: <FaDollarSign size={20} className="text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: 342,
      icon: <FaUsers size={20} className="text-white" />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "Products in Stock",
      value: 128,
      icon: <FaAppleAlt size={20} className="text-white" />,
      bgColor: "bg-red-500",
    },
  ];

  const topProducts = [
    { name: "Apples", sold: 120, stock: 300 },
    { name: "Bananas", sold: 95, stock: 150 },
    { name: "Carrots", sold: 80, stock: 200 },
    { name: "Tomatoes", sold: 70, stock: 120 },
  ];

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Sarah Lee",
      email: "sarah@example.com",
      role: "Manager",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsTable products={topProducts} />
      </div>
    </div>
  );
}
