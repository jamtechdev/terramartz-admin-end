"use client";

import { FaAppleAlt, FaDollarSign, FaUsers, FaBoxes } from "react-icons/fa";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import TopProductsTable, { Product } from "../components/dashboard/TopProductsTable";
import UserList from "../components/admin/users/UserList";
import DashboardCard from "../components/common/DashboardCard";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: 1523,
      icon: <FaBoxes size={25} className="text-white" />,
      Color: "green-500",
    },
    {
      title: "Revenue",
      value: "$45,300",
      icon: <FaDollarSign size={25} className="text-white" />,
      Color: "blue-500",
    },
    {
      title: "Active Users",
      value: 342,
      icon: <FaUsers size={25} className="text-white" />,
      Color: "yellow-500",
    },
    {
      title: "Products in Stock",
      value: 128,
      icon: <FaAppleAlt size={25} className="text-white" />,
      Color: "red-500",
    },
  ];
const topProducts: readonly Product[]= [
    {
      id: 1,
      name: "Organic Tomatoes",
      sku: "TM-001",
      category: "Vegetables",
      sold: 320,
      stock: 45,
      price: 120,
      status: "Active",
    },
    {
      id: 2,
      name: "Fresh Apples",
      sku: "AP-014",
      category: "Fruits",
      sold: 210,
      stock: 8,
      price: 180,
      status: "Active",
    },
    {
      id: 3,
      name: "Basmati Rice",
      sku: "BR-210",
      category: "Grains",
      sold: 540,
      stock: 0,
      price: 980,
      status: "Inactive",
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
            Color={stat.Color}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <TopProductsTable products={topProducts} />
        </DashboardCard>
        <DashboardCard>
          <h2 className="text-xl font-bold mb-4 text-green-700">
            Connected Users
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="bg-white hover:bg-green-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                        R
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Rahul Sharma
                        </div>
                        <div className="text-xs text-gray-500">
                          rahul.sharma@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">Admin</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Jan 10, 2025</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-green-600 hover:text-green-800">
                      View
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="bg-gray-50 hover:bg-green-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        A
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Ananya Verma
                        </div>
                        <div className="text-xs text-gray-500">
                          ananya.verma@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">Manager</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Feb 02, 2025</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-green-600 hover:text-green-800">
                      View
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="bg-white hover:bg-green-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold">
                        A
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Amit Patel
                        </div>
                        <div className="text-xs text-gray-500">
                          amit.patel@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">User</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">
                      Suspended
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Dec 18, 2024</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-green-600 hover:text-green-800">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
