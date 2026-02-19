"use client";
import { useAuth } from "@/app/context/AuthContext";
import { sellerOrderService } from "@/app/services/sellerOrder.service";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiUser, FiMapPin, FiShoppingBag } from "react-icons/fi";

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
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
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

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getImageUrl = (imageName: string) => {
        if (!imageName) return null;
        if (imageName.startsWith('http')) return imageName;
        return `${process.env.NEXT_PUBLIC_S3_DIRECT_URL}/products/${imageName}`;
    };

    const getPaymentStatusColor = (paymentStatus: string) => {
        switch (paymentStatus?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700 border border-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
            case 'failed':
                return 'bg-red-100 text-red-700 border border-red-300';
            case 'refunded':
                return 'bg-purple-100 text-purple-700 border border-purple-300';
            case 'partially_refunded':
                return 'bg-indigo-100 text-indigo-700 border border-indigo-300';
            case 'disputed':
                return 'bg-orange-100 text-orange-700 border border-orange-300';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-300';
        }
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
                        <option value="refunded">Refunded</option>
                        <option value="return_requested">Return Requested</option>
                        <option value="return_approved">Return Approved</option>
                        <option value="return_rejected">Return Rejected</option>
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
                        <option value="refunded">Refunded</option>
                        <option value="partially_refunded">Partially Refunded</option>
                        <option value="disputed">Disputed</option>
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
                                <th className="px-6 py-4 w-10"></th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4 text-center">Items</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={8} className="p-10 text-center text-gray-400">Loading orders...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={8} className="p-6 text-center text-red-600">{error}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={8} className="p-6 text-center text-gray-500">No orders found</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <>
                                        <tr
                                            key={order._id}
                                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedOrderId === order._id ? 'bg-green-50/30' : ''}`}
                                            onClick={() => toggleExpand(order._id)}
                                        >
                                            <td className="px-6 py-4">
                                                {expandedOrderId === order._id ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-medium text-green-700">#{order.orderId}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {format(new Date(order.createdAt), "dd MMM yyyy HH:mm")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.buyerName}</div>
                                                <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                                                    {order.products.length} {order.products.length === 1 ? 'Item' : 'Items'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'new' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    order.status === 'refunded' ? 'bg-purple-100 text-purple-700' :
                                                                        order.status === 'return_requested' ? 'bg-orange-100 text-orange-700' :
                                                                            order.status === 'return_approved' ? 'bg-teal-100 text-teal-700' :
                                                                                order.status === 'return_rejected' ? 'bg-rose-100 text-rose-700' :
                                                                                    'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedOrderId === order._id && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan={8} className="px-6 py-6 border-l-4 border-green-600">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {/* Buyer & Shipping Info */}
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                                                                    <FiUser className="text-green-700" />
                                                                    Buyer Information
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-2">
                                                                    <p><span className="text-gray-500">Name:</span> {order.buyerName}</p>
                                                                    <p><span className="text-gray-500">Email:</span> {order.buyerEmail}</p>
                                                                    <p><span className="text-gray-500">Phone:</span> {order.buyerPhone || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                                                                    <FiMapPin className="text-green-700" />
                                                                    Shipping Address
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                                                                    {order.shippingAddress ? (
                                                                        <>
                                                                            <p className="font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                                                            <p className="text-gray-600 mt-1">{order.shippingAddress.address}</p>
                                                                            {order.shippingAddress.apartment && <p className="text-gray-600">{order.shippingAddress.apartment}</p>}
                                                                            <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                                                            <p className="text-gray-600">{order.shippingAddress.country}</p>
                                                                            <p className="text-gray-600 mt-2 font-medium">Method: {order.shippingAddress.shippingMethod}</p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-gray-400 italic">No shipping address provided</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Product Information */}
                                                        <div>
                                                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                                                                <FiShoppingBag className="text-green-700" />
                                                                Seller's Products in this Order
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {order.products.map((p: any, i: number) => (
                                                                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 flex gap-4 items-center">
                                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                            {p.image ? (
                                                                                <img src={getImageUrl(p.image) || ''} alt={p.title} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-semibold text-gray-900 truncate">{p.title || 'Unknown Product'}</p>
                                                                            <p className="text-xs text-gray-500">ID: {p.productId.substring(0, 12)}...</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-sm font-bold text-green-700">${p.price}</p>
                                                                            <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div className="pt-3 border-t border-dashed border-gray-300 mt-3 flex justify-between items-center text-sm">
                                                                    <span className="font-medium text-gray-700">Seller's Subtotal:</span>
                                                                    <span className="font-bold text-green-700 text-lg">
                                                                        ${order.products.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
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
