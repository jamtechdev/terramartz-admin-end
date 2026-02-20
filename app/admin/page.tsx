"use client";

import { FaAppleAlt, FaDollarSign, FaUsers, FaBoxes, FaFileAlt } from "react-icons/fa";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import DashboardCard from "../components/common/DashboardCard";
import SalesAnalytics from "../components/charts/SalesAnalyticsChart";
import OrderStatusAreaChart from "../components/charts/OrderStatusAreaChart";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboard.service";
import {
  DashboardStatsApiResponse,
  SectionFourApiResponse,
  SectionFourResponse,
  SectionThreeApiResponse,
  SectionThreeResponse,
  SectionTwoApiResponse,
  SectionTwoResponse,
  StatCard,
} from "../types/admin-dashboard";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [sectionTwoData, setSectionTwoData] =
    useState<SectionTwoResponse | null>(null);
  const [sectionThreeData, setSectionThreeData] =
    useState<SectionThreeResponse | null>(null);
  const [sectionFourData, setSectionFourData] =
    useState<SectionFourResponse | null>(null);
  const { token, user, hasPermission, loading, isAuthenticated } = useAuth();

  const router = useRouter();
  const vendors = sectionThreeData?.vendorsApproval ?? [];

  // Check if user has Dashboard access
  useEffect(() => {
    if (!loading && !hasPermission("Dashboard", "View")) {
      router.push("/");
    }
  }, [loading, hasPermission, router]);

  // ✅ Check if user has Dashboard access
  useEffect(() => {
    if (!loading && !hasPermission("Dashboard", "View")) {
      router.push("/");
    }
  }, [loading, hasPermission, router]);

  const getStats = async () => {
    if (!token) return;

    const res = (await dashboardService.getSectionOne(
      token,
    )) as DashboardStatsApiResponse;

    if (res.success) {
      const mappedStats = [
        {
          title: "Total Orders",
          value: res.data?.totalOrder,
          icon: <FaBoxes size={40} className="text-white" />,
          BgColor: "bg-green-500",
          BorderColor: "border-green-500",
        },
        {
          title: "Revenue",
          value: "$" + res.data?.revenue,
          icon: <FaDollarSign size={40} className="text-white" />,
          BgColor: "bg-blue-500",
          BorderColor: "border-blue-500",
        },
        {
          title: "Active Users",
          value: res.data?.activeUsers,
          icon: <FaUsers size={40} className="text-white" />,
          BgColor: "bg-yellow-500",
          BorderColor: "border-yellow-500",
        },
        {
          title: "Products in Stock",
          value: res.data?.productInStock,
          icon: <FaAppleAlt size={40} className="text-white" />,
          BgColor: "bg-red-500",
          BorderColor: "border-red-500",
        },
      ];

      setStats(mappedStats);
    }
  };

  const getSectionTwo = async () => {
    if (!token) return;

    const res = (await dashboardService.getSectionTwo(
      token,
    )) as SectionTwoApiResponse;

    if (res.success) {
      setSectionTwoData(res.data);
    }
  };

  const getSectionThree = async () => {
    if (!token) return;

    const res = (await dashboardService.getSectionThree(
      token,
    )) as SectionThreeApiResponse;

    if (res.success) {
      setSectionThreeData(res.data);
    }
  };

  const getSectionFour = async () => {
    if (!token) return;

    const res = (await dashboardService.getSectionFour(
      token,
    )) as SectionFourApiResponse;

    if (res.success) {
      setSectionFourData(res.data);
    }
  };

  useEffect(() => {
    if (token && hasPermission("Dashboard", "View")) {
      getStats();
      getSectionTwo();
      getSectionThree();
      getSectionFour();
    }
  }, [token]);

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // ✅ Check permission before rendering
  if (!hasPermission("Dashboard", "View")) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" />

      {/* ✅ Welcome Section with User Info */}
      {user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-green-100 mt-1">
            You're logged in as{" "}
            <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ Only show if user has Payments permission */}
        {hasPermission("Payments", "View") && (
          <DashboardCard>
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-green-700">
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sectionTwoData?.recentPurchases
                    ?.slice(0, 5)
                    .map((purchase) => (
                      <tr
                        key={purchase.orderId}
                        className="hover:bg-green-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {purchase.orderId}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-semibold">
                          ${purchase.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {purchase.paymentMethod}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${purchase.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Monthly Revenue
          </h2>
          <SalesAnalytics data={sectionTwoData?.monthlyRevenue ?? []} />
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            Order status
          </h2>
          <OrderStatusAreaChart orderStats={sectionTwoData?.orderStats} />
        </DashboardCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Only show if user has Products permission */}
        {hasPermission("Products", "View") && (
          <DashboardCard>
            <TopProductsTable topProducts={sectionThreeData?.topProducts} />
          </DashboardCard>
        )}

        {/* ✅ Only show if user has Vendors permission */}
        {hasPermission("Vendors", "View") && (
          <DashboardCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                Vendor Approval Queue
              </h2>
              <button
                onClick={() => router.push("/admin/kyc")}
                className="text-sm font-semibold text-green-600 hover:text-green-800 transition"
              >
                View All
              </button>
            </div>

            {/* <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              {sectionThreeData?.vendorsApproval &&
                sectionThreeData.vendorsApproval.length > 0 ? (
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
                    {sectionThreeData.vendorsApproval
                      .slice(0, 3)
                      .map((vendor) => (
                        <tr
                          key={vendor._id}
                          className="hover:bg-green-50 transition"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {vendor.vendorName}
                          </td>
                          <td className="px-6 py-4 text-green-600">
                            {vendor.hasLicense ? "✔" : "✘"}
                          </td>
                          <td className="px-6 py-4 text-green-600">
                            {vendor.hasTaxId ? "✔" : "✘"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vendor.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : vendor.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {vendor.status === "Pending" &&
                              hasPermission("Vendors", "Full") && (
                                <button
                                  onClick={() =>
                                    router.push(`/admin/kyc?id=${vendor.kycId}`)
                                  }
                                  className="text-sm font-medium text-green-600 hover:text-green-800"
                                >
                                  Review
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FaFileAlt className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Applications Found
                  </h3>
                  <p className="text-gray-600">
                    There are no vendor KYC applications to display.
                  </p>
                </div>
              )}
            </div> */}


            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm whitespace-nowrap">

                {/* ===== TABLE HEADER ===== */}
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

                {/* ===== TABLE BODY ===== */}
                <tbody className="divide-y divide-gray-100">

                  {vendors.length > 0 ? (

                    vendors.slice(0, 3).map((vendor) => (
                      <tr
                        key={vendor._id}
                        className="hover:bg-green-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {vendor.vendorName}
                        </td>

                        <td className="px-6 py-4 text-green-600">
                          {vendor.hasLicense ? "✔" : "✘"}
                        </td>

                        <td className="px-6 py-4 text-green-600">
                          {vendor.hasTaxId ? "✔" : "✘"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vendor.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : vendor.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                          >
                            {vendor.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right space-x-2">
                          {vendor.status === "Pending" &&
                            hasPermission("Vendors", "Full") && (
                              <button
                                onClick={() =>
                                  router.push(`/admin/kyc?id=${vendor.kycId}`)
                                }
                                className="text-sm font-medium text-green-600 hover:text-green-800"
                              >
                                Review
                              </button>
                            )}
                        </td>
                      </tr>
                    ))

                  ) : (

                    /* ===== EMPTY STATE INSIDE TABLE ===== */
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center text-gray-500">
                          <FaFileAlt className="w-12 h-12 mb-3 text-gray-300" />

                          <h3 className="text-lg font-medium text-gray-900">
                            No Applications Found
                          </h3>

                          <p className="text-gray-600 text-sm mt-1">
                            There are no vendor KYC applications to display.
                          </p>
                        </div>
                      </td>
                    </tr>

                  )}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </div>

      {/* ✅ Only show map if user has Vendors permission */}
      {hasPermission("Vendors", "View") && (
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
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Only show if user has Payments permission */}
        {hasPermission("Payments", "View") && (
          <DashboardCard>
            <h2 className="text-2xl font-bold mb-6 text-green-700">
              Recent Transactions
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-green-700">
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-white">
                      Buyer
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
                  {sectionTwoData?.recentPurchases
                    ?.slice(0, 4)
                    .map((purchase) => (
                      <tr
                        key={purchase.orderId}
                        className="hover:bg-green-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {purchase.orderId}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {purchase.shippingAddress.email}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-semibold">
                          ${purchase.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {purchase.paymentMethod}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}

        {/* ✅ Only show if user has Logistics permission */}
        {hasPermission("Logistics", "View") && (
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
                      name: "BlueForce Couriers",
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
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Only show if user has Vendors permission */}
        {hasPermission("Vendors", "View") && (
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
                      id: "TMX4329",
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
        )}

        {/* ✅ Only show if user has Support permission */}
        {hasPermission("Support", "View") && (
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
                  {sectionFourData?.supportTickets?.map((t) => (
                    <tr
                      key={t.category}
                      className="hover:bg-green-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {t.category}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{t.open}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {t.avgResponse}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{t.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
