/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/app/services/transaction.service";
import { format } from "date-fns";

type Transaction = {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: string;
  paymentStatus: string;
  date: string;
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

  // Fetch transactions
  const fetchTransactions = async (
    pageNum = page,
    searchTerm = search,
    statusTerm = statusFilter,
    paymentTerm = paymentStatusFilter
  ) => {
    setLoading(true);
    try {
      const data = await transactionService.getAllTransactions(
        pageNum,
        limit,
        searchTerm.trim(),
        statusTerm,
        paymentTerm
      );

      const mappedTransactions: Transaction[] = data.transactions.map((txn: any) => ({
        _id: txn._id,
        buyerName: txn.buyerName || "N/A",
        buyerEmail: txn.buyerEmail || "N/A",
        amount: txn.amount || 0,
        status: txn.status || "N/A",
        paymentStatus: txn.paymentStatus || "N/A",
        date: txn.date || "",
      }));

      setTransactions(mappedTransactions);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
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
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="new">New</option>
        </select>

        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="">All Payment Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
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
              <th className="px-6 py-4 text-left font-semibold text-white flex items-center gap-1">Buyer Name</th>            
              <th className="px-6 py-4 text-left font-semibold text-white">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Payment Status</th>
              <th className="px-6 py-4 text-left font-semibold text-white">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center text-black py-6">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-black py-6">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr
                  key={txn._id}
                  className={`transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-700">{txn.buyerName}</td>
                  <td className="px-6 py-4 text-gray-700">{txn.buyerEmail}</td>
                  <td className="px-6 py-4 text-gray-700">${txn.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : txn.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        txn.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(txn.date)}</td>
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
