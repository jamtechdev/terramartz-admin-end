"use client";

import { FaAppleAlt, FaDollarSign, FaUsers, FaBoxes } from "react-icons/fa";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import TopProductsTable, {
  Product,
} from "../components/dashboard/TopProductsTable";
import DashboardCard from "../components/common/DashboardCard";
import RevenueDonutChart from "../components/charts/RevenueDonutChart";
import SalesAnalytics from "../components/charts/SalesAnalyticsChart";
import OrderStatusAreaChart from "../components/charts/OrderStatusAreaChart";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: 1523,
      icon: <FaBoxes size={40} className="text-white" />,
      BgColor: "bg-green-500",
      BorderColor: "border-green-500",
    },
    {
      title: "Revenue",
      value: "$45,300",
      icon: <FaDollarSign size={40} className="text-white" />,
      BgColor: "bg-blue-500",
      BorderColor: "border-blue-500",
    },
    {
      title: "Active Users",
      value: 342,
      icon: <FaUsers size={40} className="text-white" />,
      BgColor: "bg-yellow-500",
      BorderColor: "border-yellow-500",
    },
    {
      title: "Products in Stock",
      value: 128,
      icon: <FaAppleAlt size={40} className="text-white" />,
      BgColor: "bg-red-500",
      BorderColor: "border-red-500",
    },
  ];

  const topProducts: readonly Product[] = [
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
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Recent Transactions
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="flex-1">
              <ul className="divide-y divide-gray-100">
                <li className="flex items-center justify-between py-3 hover:bg-green-50 px-2 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Terramartz Express
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    $22.1k
                  </span>
                </li>

                <li className="flex items-center justify-between py-3 hover:bg-green-50 px-2 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-gray-800">
                      Vendor Self-Delivery
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    $16.2k
                  </span>
                </li>

                <li className="flex items-center justify-between py-3 hover:bg-green-50 px-2 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-lime-500" />
                    <span className="text-sm font-medium text-gray-800">
                      3PL Partners
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    $4.9k
                  </span>
                </li>

                <li className="flex items-center justify-between py-3 hover:bg-green-50 px-2 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-teal-500" />
                    <span className="text-sm font-medium text-gray-800">
                      Micro-Hub Fulfillment
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    $2.1k
                  </span>
                </li>
              </ul>
            </div>
            <RevenueDonutChart />
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Monthly Revenue
          </h2>
          <SalesAnalytics />
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Order status
          </h2>
          <OrderStatusAreaChart />
        </DashboardCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <TopProductsTable products={topProducts} />
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Vendor Approval Queue
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    License
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Tax ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "Kajjal Foods", status: "Pending" },
                  { name: "Raju’s Mart", status: "Pending" },
                  { name: "Mithani Spices", status: "Rejected" },
                ].map((v) => (
                  <tr key={v.name} className="hover:bg-green-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {v.name}
                    </td>
                    <td className="px-6 py-4 text-green-600">✔</td>
                    <td className="px-6 py-4 text-green-600">✔</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          v.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-sm font-medium text-green-600 hover:text-green-800">
                        Approve
                      </button>
                      <button className="text-sm font-medium text-red-600 hover:text-red-800">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

       <div className="mt-8 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Vendor Performance Map
          </h2>

          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
            <iframe
              title="Dummy Google Map"
              src="https://maps.google.com/maps?q=New%20Delhi&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </DashboardCard>
      </div>


      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Recent Transactions
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    id: "TMX4325",
                    user: "Rahul Sharma",
                    total: "$94.00",
                    payment: "Wallet",
                  },
                  {
                    id: "TMX4321",
                    user: "Ananya Verma",
                    total: "$54.00",
                    payment: "PayPal",
                  },
                  {
                    id: "TMX4327",
                    user: "Aman Agul",
                    total: "$26.00",
                    payment: "Wallet",
                  },
                  {
                    id: "TMX4327",
                    user: "Aman Agul",
                    total: "$26.00",
                    payment: "Wallet",
                  },
                ].map((tx) => (
                  <tr key={tx.id} className="hover:bg-green-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tx.user}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {tx.total}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tx.payment}</td>
                    <td className="px-6 py-4 text-gray-500">Apr 24, 2025</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Delivery SLA Monitoring
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    SLA
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Delay Rate
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    name: "Terramartz Express",
                    orders: 169,
                    sla: "99%",
                    delay: "1%",
                  },
                  {
                    name: "QuickFleet Logistics",
                    orders: 128,
                    sla: "98%",
                    delay: "2%",
                  },
                  {
                    name: "HandyPack Couriers",
                    orders: 96,
                    sla: "96%",
                    delay: "4%",
                  },
                  {
                    name: "HandyPack Couriers",
                    orders: 96,
                    sla: "96%",
                    delay: "4%",
                  },
                ].map((sla) => (
                  <tr key={sla.name} className="hover:bg-green-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {sla.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{sla.orders}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {sla.sla}
                    </td>
                    <td className="px-6 py-4 text-red-600 font-semibold">
                      {sla.delay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Vendor Alerts
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-white">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    id: "TMX4325",
                    total: "$94.00",
                    payment: "Wallet",
                  },
                  {
                    id: "TMX4321",
                    total: "$54.00",
                    payment: "PayPal",
                  },
                  {
                    id: "TMX4327",
                    total: "$26.00",
                    payment: "Wallet",
                  },
                ].map((tx) => (
                  <tr key={tx.id} className="hover:bg-green-50 transition">
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
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {tx.total}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tx.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Support Tickets
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Open
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Avg. Response
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Priority
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    category: "Order Issue",
                    open: 8,
                    time: "1 hr",
                    priority: "High",
                  },
                  {
                    category: "Payment Issue",
                    open: 5,
                    time: "1.5 hr",
                    priority: "Medium",
                  },
                  {
                    category: "Vendor Support",
                    open: 3,
                    time: "4 hr",
                    priority: "Low",
                  },
                ].map((t) => (
                  <tr key={t.category} className="hover:bg-green-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {t.category}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{t.open}</td>
                    <td className="px-6 py-4 text-gray-700">{t.time}</td>
                    <td className="px-6 py-4 text-gray-700">{t.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
