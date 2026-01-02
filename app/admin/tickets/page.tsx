"use client";

import DashboardCard from "@/app/components/common/DashboardCard";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { useState } from "react";
import { RiTicketLine, RiShoppingBag3Line } from "react-icons/ri";

type OrderStatus = "Placed" | "Cancelled" | "Delivered";

type Order = {
  id: string;
  product: string;
  date: string;
  amount: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: "ORD-1001",
    product: "Wireless Headphones",
    date: "02 Jan 2026",
    amount: "₹2,499",
    status: "Placed",
  },
  {
    id: "ORD-1002",
    product: "Smart Watch",
    date: "28 Dec 2025",
    amount: "₹4,999",
    status: "Delivered",
  },
  {
    id: "ORD-1003",
    product: "Bluetooth Speaker",
    date: "20 Dec 2025",
    amount: "₹1,999",
    status: "Cancelled",
  },
];

const statusColor = {
  Placed: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function TicketPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Support Ticket" />

      <div className="overflow-y-hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700">
              <th className="px-6 py-4 text-left font-semibold text-white">
                Order ID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Product
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-green-50`}
              >
                <td className="px-6 py-4 text-gray-700">{order.id}</td>
                <td className="px-6 py-4 text-gray-700">
                  <RiShoppingBag3Line className="text-gray-400" />
                  {order.product}
                </td>
                <td className="px-6 py-4 text-gray-700">{order.date}</td>
                <td className="px-6 py-4 text-gray-700">{order.amount}</td>
                <td className="px-6 py-4 text-gray-700">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColor[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Raise Ticket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Form */}
      {selectedOrder && (
        <DashboardCard>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Raise Ticket for {selectedOrder.product}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-black block text-lg">Issue Type</label>
              <select className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500">
                <option>Product not delivered</option>
                <option>Damaged product</option>
                <option>Wrong item received</option>
                <option>Refund related</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-black block text-lg">
                Issue Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your issue..."
                className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold">
              Submit Ticket
            </button>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
