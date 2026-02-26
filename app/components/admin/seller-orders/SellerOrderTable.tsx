"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { sellerOrderService } from "@/app/services/sellerOrder.service";
import Link from "next/link";
import { format } from "date-fns";

export const Loader = () => (
    <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
    </div>
);

export default function SellerOrderTable() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const { token } = useAuth();

    useEffect(() => {
        fetchSellers();
    }, [page, token]);

    const fetchSellers = async (searchTerm = search) => {
        if (!token) return;
        setLoading(true);
        setError("");

        const res = await sellerOrderService.getSellersWithStats(page, limit, searchTerm, token);
        if (res.success) {
            setSellers(res.data.sellers);
            setTotalPages(Math.ceil(res.data.total / limit));
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchSellers();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search seller by name or shop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Seller/Shop Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Total Orders</th>
                            <th className="px-6 py-4">Joined At</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5}><Loader /></td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="p-6 text-center text-red-600">{error}</td></tr>
                        ) : sellers.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">No sellers found</td></tr>
                        ) : (
                            sellers.map((seller) => (
                                <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {seller.shopName || seller.businessName || seller.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{seller.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                            {seller.totalOrders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {seller.createdAt ? format(new Date(seller.createdAt), "dd MMM yyyy") : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/seller-orders/${seller._id}`}
                                            className="bg-green-700 text-white px-4 py-1.5 rounded-lg hover:bg-green-800 transition-colors text-xs font-medium"
                                        >
                                            View Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Prev
                    </button>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
