"use client";

import { useState, useEffect, useCallback } from "react";
import { PromoCode, promoCodeService } from "@/app/services/promoCode.service";
import PromoCodeModal from "./PromoCodeModal";
import PromoCodeUsageModal from "./PromoCodeUsageModal";
import DeleteConfirmModal from "@/app/components/common/DeleteConfirmModal";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getReadableAccessError } from "@/app/utils/accessError";

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

export default function PromoCodeList() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [open, setOpen] = useState(false);
  const [editPromoCode, setEditPromoCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usagePromoCode, setUsagePromoCode] = useState<PromoCode | null>(null);
  const [usageModalOpen, setUsageModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const { token, hasPermission } = useAuth();
  const router = useRouter();

  const hasFullAccess = hasPermission("Promo Codes", "Full");

  const fetchPromoCodes = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await promoCodeService.getAllPromoCodes({
        token,
        page,
        limit,
        search: search.trim(),
        type: typeFilter,
        isActive: statusFilter,
      });

      setPromoCodes(res.promoCodes || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / limit));
    } catch (error: any) {
      toast.error(getReadableAccessError(error, "Failed to fetch promo codes"));
      if (error.response?.status === 401) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, router, page, limit, search, typeFilter, statusFilter]);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const handleAdd = () => {
    setEditPromoCode(null);
    setOpen(true);
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditPromoCode(promoCode);
    setOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!token) return;

    setSaving(true);
    setLoading(true);

    try {
      if (editPromoCode) {
        await promoCodeService.updatePromoCode(editPromoCode._id, data, token);
        toast.success("Promo code updated successfully.");
      } else {
        await promoCodeService.createPromoCode(data, token);
        toast.success("Promo code created successfully.");
      }

      setOpen(false);
      setEditPromoCode(null);
      fetchPromoCodes();
    } catch (error: any) {
      toast.error(getReadableAccessError(error, "Failed to save promo code"));
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;

    setDeleting(true);

    try {
      await promoCodeService.deletePromoCode(deleteId, token);
      toast.success("Promo code deleted successfully.");
      setDeleteId(null);
      fetchPromoCodes();
    } catch (error: any) {
      toast.error(getReadableAccessError(error, "Failed to delete promo code"));
      if (error.response?.status === 401) {
        router.push("/admin/login");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (!token || !hasFullAccess) return;

    const promoCode = promoCodes.find((p) => p._id === id);
    if (!promoCode) return;

    setLoading(true);

    try {
      await promoCodeService.updatePromoCode(
        id,
        { isActive: !promoCode.isActive },
        token
      );
      toast.success("Promo code status updated successfully.");
      fetchPromoCodes();
    } catch (error: any) {
      toast.error(getReadableAccessError(error, "Failed to update status"));
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsage = (promoCode: PromoCode) => {
    setUsagePromoCode(promoCode);
    setUsageModalOpen(true);
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return format(new Date(dateStr), "dd MMM yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      {hasFullAccess && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAdd}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
          >
            + Create Promo Code
          </button>
        </div>
      )}

      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Search by code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[200px] text-sm transition-colors"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
        >
          <option value="">All Types</option>
          <option value="fixed">Fixed Amount</option>
          <option value="percentage">Percentage</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm"
        >
          Filter
        </button>

        {(search || typeFilter || statusFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-4 text-left font-semibold">Code</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
              <th className="px-6 py-4 text-left font-semibold">Discount</th>
              <th className="px-6 py-4 text-left font-semibold">Min Order</th>
              <th className="px-6 py-4 text-left font-semibold">Usage</th>
              <th className="px-6 py-4 text-left font-semibold">Expires</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <Loader />
                </td>
              </tr>
            ) : promoCodes.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-700">
                  No promo codes found
                </td>
              </tr>
            ) : (
              promoCodes.map((promoCode, index) => (
                <tr
                  key={promoCode._id}
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {promoCode.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        promoCode.type === "fixed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {promoCode.type === "fixed" ? "Fixed" : "Percentage"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {promoCode.type === "fixed"
                      ? formatCurrency(promoCode.discount)
                      : `${promoCode.discount}%`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {promoCode.minOrderAmount > 0
                      ? formatCurrency(promoCode.minOrderAmount)
                      : "No minimum"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="font-medium">{promoCode.usedCount}</span>
                    {promoCode.usageLimit && (
                      <span className="text-gray-400"> / {promoCode.usageLimit}</span>
                    )}
                    <div className="text-xs text-gray-400">
                      {promoCode.perUserLimit} per user
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(promoCode.expiresAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        promoCode.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {promoCode.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewUsage(promoCode)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        Usage
                      </button>
                      {hasFullAccess && (
                        <>
                          <button
                            onClick={() => handleEdit(promoCode)}
                            className="text-green-700 hover:text-green-800 text-xs font-semibold hover:underline transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(promoCode._id)}
                            className="text-amber-600 hover:text-amber-700 text-xs font-semibold hover:underline transition-colors"
                          >
                            {promoCode.isActive ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => handleDelete(promoCode._id)}
                            className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-gray-700">
        <span className="text-sm font-medium">
          Showing {promoCodes.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
          {Math.min(page * limit, total)} of {total} promo codes
        </span>

        <div className="flex items-center justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {open && (
        <PromoCodeModal
          promoCode={editPromoCode}
          loading={saving}
          onClose={() => {
            setOpen(false);
            setEditPromoCode(null);
          }}
          onSave={handleSave}
        />
      )}

      {usageModalOpen && usagePromoCode && (
        <PromoCodeUsageModal
          promoCode={usagePromoCode}
          open={usageModalOpen}
          onClose={() => {
            setUsageModalOpen(false);
            setUsagePromoCode(null);
          }}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Promo Code"
        message="This action cannot be undone. Are you sure you want to delete this promo code?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
