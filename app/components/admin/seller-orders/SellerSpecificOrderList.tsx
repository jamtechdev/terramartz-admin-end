"use client";
import { useAuth } from "@/app/context/AuthContext";
import { sellerOrderService } from "@/app/services/sellerOrder.service";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SellerSpecificOrderList({ sellerId }: { sellerId: string }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [seller, setSeller] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const { token } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, [page, token, sellerId]);

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        setError("");

        const res = await sellerOrderService.getSellerOrders(
            sellerId,
            page,
            limit,
            search,
            status,
            paymentStatus,
            token
        );

        if (res.success) {
            setOrders(res.data.orders);
            setSeller(res.data.seller);
            setTotalPages(Math.ceil(res.data.total / limit));
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    return (
        <div className="space-y-4">
            {seller && (
                <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center border border-green-100">
                    <div>
                        <h3 className="text-lg font-bold text-green-800">{seller.shopName || seller.name}</h3>
                        <p className="text-sm text-green-600">Showing all orders for this seller</p>
                    </div>
                    <Link href="/admin/seller-orders" className="text-green-700 font-medium hover:underline text-sm">
                        Back to Sellers
                    </Link>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleFilter} className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search Order ID or Buyer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm"
                    >
                        <option value="">Payment Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>
                    <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium">
                        Filter
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-gray-400">Loading orders...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="p-6 text-center text-red-600">{error}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="p-6 text-center text-gray-500">No orders found</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-green-700">#{order.orderId}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {format(new Date(order.createdAt), "dd MMM yyyy HH:mm")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.buyerName}</div>
                                            <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs">
                                                {order.products.map((p: any, i: number) => (
                                                    <div key={i}>{p.quantity}x (Product ID: {p.product.substring(0, 8)})</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'new' ? 'bg-green-100 text-green-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm">
                    <span className="text-gray-600">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
