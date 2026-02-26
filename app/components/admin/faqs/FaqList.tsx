"use client";

import { useState, useEffect, useCallback } from "react";
import { faqService, Faq, FaqResponse } from "@/app/services/faq.service";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-hot-toast";
import { RiEditLine, RiDeleteBinLine, RiSearchLine, RiAddLine } from "react-icons/ri";
import FaqModal from "./FaqModal";

export default function FaqList() {
    const { token, hasPermission } = useAuth();

    // Data state
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtering and pagination state
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isActiveFilter, setIsActiveFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const loadFaqs = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res: FaqResponse = await faqService.adminGetAllFaqs({
                page,
                limit,
                search: debouncedSearch,
                isActive: isActiveFilter,
                token,
            });
            setFaqs(res.data);
            setTotalPages(res.totalPages || 1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    }, [page, token, debouncedSearch, isActiveFilter]);

    useEffect(() => {
        loadFaqs();
    }, [loadFaqs]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            if (!token) return;
            await faqService.deleteFaq(id, token);
            toast.success("FAQ deleted successfully");
            loadFaqs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete FAQ");
        }
    };

    const handleEdit = (faq: Faq) => {
        setSelectedFaq(faq);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedFaq(null);
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        loadFaqs();
    };

    // Optional: check permissions
    const canEdit = hasPermission("Support", "Full") || true; // Adjust according to your role system

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex-1 flex gap-4 w-full">
                    <div className="relative flex-1 max-w-md">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by question or answer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <select
                        value={isActiveFilter}
                        onChange={(e) => {
                            setIsActiveFilter(e.target.value);
                            setPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                {canEdit && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shrink-0"
                    >
                        <RiAddLine /> Add FAQ
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="p-4 font-semibold text-gray-600">Question</th>
                            <th className="p-4 font-semibold text-gray-600">Answer</th>
                            <th className="p-4 font-semibold text-gray-600 w-24">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Loading FAQs...
                                </td>
                            </tr>
                        ) : faqs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No FAQs found.
                                </td>
                            </tr>
                        ) : (
                            faqs.map((faq) => (
                                <tr key={faq._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 max-w-xs truncate" title={faq.question}>{faq.question}</td>
                                    <td className="p-4 max-w-md truncate" title={faq.answer}>{faq.answer}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${faq.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {faq.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <RiEditLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            <FaqModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                faq={selectedFaq}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
