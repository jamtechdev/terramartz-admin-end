"use client";

import PromoCodeForm from "./PromoCodeForm";
import { PromoCode } from "@/app/services/promoCode.service";

export default function PromoCodeModal({
  promoCode,
  loading,
  onClose,
  onSave,
}: {
  promoCode: PromoCode | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: {
    code: string;
    discount: number;
    expiresAt?: string;
    minOrderAmount: number;
    type: "fixed" | "percentage";
    isActive: boolean;
    usageLimit: number | null;
    perUserLimit: number;
  }) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-black font-bold mb-4">
          {promoCode ? "Edit Promo Code" : "Create Promo Code"}
        </h2>

        <PromoCodeForm
          initialData={promoCode ? {
            code: promoCode.code,
            discount: promoCode.discount,
            expiresAt: promoCode.expiresAt ? new Date(promoCode.expiresAt).toISOString().split("T")[0] : "",
            minOrderAmount: promoCode.minOrderAmount,
            type: promoCode.type,
            isActive: promoCode.isActive,
            usageLimit: promoCode.usageLimit,
            perUserLimit: promoCode.perUserLimit,
          } : undefined}
          onSubmit={onSave}
          loading={loading}
        />
        <button
          onClick={onClose}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
