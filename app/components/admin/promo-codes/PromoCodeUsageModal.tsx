"use client";

import { useState, useEffect, useCallback } from "react";
import { PromoCode, promoCodeService, PromoCodeUsage } from "@/app/services/promoCode.service";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

interface PromoCodeUsageModalProps {
  promoCode: PromoCode;
  open: boolean;
  onClose: () => void;
}

export default function PromoCodeUsageModal({
  promoCode,
  open,
  onClose,
}: PromoCodeUsageModalProps) {
  const [usageData, setUsageData] = useState<{
    totalUses: number;
    uniqueUsers: number;
    usageDetails: PromoCodeUsage[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const fetchUsage = useCallback(async () => {
    if (!token || !open) return;

    setLoading(true);

    try {
      const res = await promoCodeService.getPromoCodeUsage(promoCode._id, token);
      setUsageData({
        totalUses: res.totalUses,
        uniqueUsers: res.uniqueUsers,
        usageDetails: res.usageDetails,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch usage data");
    } finally {
      setLoading(false);
    }
  }, [token, promoCode._id, open]);

  useEffect(() => {
    if (open) {
      fetchUsage();
    }
  }, [open, fetchUsage]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "dd MMM yyyy HH:mm");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-black font-bold">
              Promo Code Usage
            </h2>
            <p className="text-sm text-gray-500">
              Code: <span className="font-mono font-semibold">{promoCode.code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : usageData ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{usageData.totalUses}</div>
                <div className="text-sm text-gray-600">Total Uses</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{usageData.uniqueUsers}</div>
                <div className="text-sm text-gray-600">Unique Users</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {promoCode.usageLimit ? `${promoCode.usedCount} / ${promoCode.usageLimit}` : promoCode.usedCount}
                </div>
                <div className="text-sm text-gray-600">
                  {promoCode.usageLimit ? "Usage / Limit" : "Used (No Limit)"}
                </div>
              </div>
            </div>

            {usageData.usageDetails.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Order Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Used At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usageData.usageDetails.map((usage) => (
                      <tr key={usage._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {usage.user_id?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {usage.user_id?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {usage.purchase_id ? (
                            formatCurrency(usage.purchase_id.totalAmount)
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(usage.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-lg mb-2">No usage yet</p>
                <p className="text-sm">This promo code has not been used by any customers.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load usage data
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition w-full mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
}
