/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/app/services/transaction.service";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";

type Product = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  isDeleted: boolean;
};

type Transaction = {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: string;
  paymentStatus: string;
  date: string;
  products: Product[];
  totalProducts: number;
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const { token } = useAuth();

  // Fetch transactions
  const fetchTransactions = async (
    pageNum = page,
    searchTerm = search,
    statusTerm = statusFilter,
    paymentTerm = paymentStatusFilter,
  ) => {
    if (!token) return;

    setLoading(true);
    setError("");

    const res = await transactionService.getAllTransactions(
      pageNum,
      limit,
      searchTerm.trim(),
      statusTerm,
      paymentTerm,
      token,
    );

    if (!res.success) {
      setError(res.message || "");
      setLoading(false);
      return;
    }

    const data = res.data;

    const mappedTransactions: Transaction[] = data.transactions.map(
      (txn: any) => ({
        _id: txn._id,
        buyerName: txn.buyerName || "N/A",
        buyerEmail: txn.buyerEmail || "N/A",
        amount: txn.amount || 0,
        status: txn.status || "N/A",
        paymentStatus: txn.paymentStatus || "N/A",
        date: txn.date || "",
        products: txn.products || [],
        totalProducts: txn.totalProducts || 0,
      }),
    );

    setTransactions(mappedTransactions);
    setTotalPages(Math.ceil(data.total / limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  // Filter submission
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions(1, search, statusFilter, paymentStatusFilter);
  };

  // Reset filters
  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPage(1);
    fetchTransactions(1, "", "", "");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "do MMM''yy");
  };

  // 🔹 Helper function to get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "processing":
      case "new":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔹 Helper function to get payment status badge styling
  const getPaymentStatusBadgeClass = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
      case "partially_refunded":
        return "bg-purple-100 text-purple-700";
      case "disputed":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-wrap items-center gap-2 w-full"
      >
        <input
          type="text"
          placeholder="Search by buyer name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500 min-w-[200px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="partially_refunded">Partially Refunded</option>
          <option value="disputed">Disputed</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
        >
          Filter
        </button>

        {(search || statusFilter || paymentStatusFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        )}
      </form>

      {/* Transactions Table */}
      <div className="overflow-y-hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700">
              <th className="px-6 py-4 text-left font-semibold text-white">
                Buyer Name
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Email
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Products
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Total Items
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Payment Status
              </th>
              <th className="px-6 py-4 text-left font-semibold text-white">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-black py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center text-black py-6">
                  {error}
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-black py-6">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr
                  key={txn._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-700">{txn.buyerName}</td>
                  <td className="px-6 py-4 text-gray-700">{txn.buyerEmail}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="space-y-1">
                      {txn.products.map((product, idx) => (
                        <div
                          key={idx}
                          className={`text-xs flex items-center gap-2 ${
                            product.isDeleted ? "opacity-60" : ""
                          }`}
                        >
                          <span
                            className={`font-medium ${
                              product.isDeleted
                                ? "line-through text-red-600"
                                : ""
                            }`}
                          >
                            {product.productName}
                          </span>
                          <span className="text-gray-500">
                            (x{product.quantity})
                          </span>
                          {product.isDeleted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">
                              Deleted
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-center">
                    {txn.totalProducts}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ${txn.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                        txn.status,
                      )}`}
                    >
                      {txn.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusBadgeClass(
                        txn.paymentStatus,
                      )}`}
                    >
                      {txn.paymentStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(txn.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 mt-4 text-black">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-green-700 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-green-700 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
