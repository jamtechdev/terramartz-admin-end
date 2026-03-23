"use client";

import { useState, useEffect } from "react";

interface PromoCodeFormData {
  code: string;
  discount: number;
  expiresAt?: string;
  minOrderAmount: number;
  type: "fixed" | "percentage";
  isActive: boolean;
  usageLimit: number | null;
  perUserLimit: number;
}

interface PromoCodeFormProps {
  initialData?: Partial<PromoCodeFormData>;
  onSubmit: (data: PromoCodeFormData) => void;
  loading?: boolean;
}

export default function PromoCodeForm({
  initialData,
  onSubmit,
  loading,
}: PromoCodeFormProps) {
  const [code, setCode] = useState(initialData?.code || "");
  const [discount, setDiscount] = useState(initialData?.discount?.toString() || "");
  const [expiresAt, setExpiresAt] = useState(initialData?.expiresAt || "");
  const [minOrderAmount, setMinOrderAmount] = useState(
    initialData?.minOrderAmount?.toString() || "0"
  );
  const [type, setType] = useState<"fixed" | "percentage">(initialData?.type || "fixed");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [usageLimit, setUsageLimit] = useState(
    initialData?.usageLimit?.toString() || ""
  );
  const [perUserLimit, setPerUserLimit] = useState(
    initialData?.perUserLimit?.toString() || "1"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: PromoCodeFormData = {
      code: code.trim().toUpperCase(),
      discount: parseFloat(discount) || 0,
      minOrderAmount: parseFloat(minOrderAmount) || 0,
      type,
      isActive,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      perUserLimit: parseInt(perUserLimit) || 1,
    };
    
    if (expiresAt) {
      data.expiresAt = expiresAt;
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Promo Code *
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          placeholder="e.g., SUMMER2024"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Code will be converted to uppercase</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discount Type *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "fixed" | "percentage")}
          disabled={loading}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          required
        >
          <option value="fixed">Fixed Amount ($)</option>
          <option value="percentage">Percentage (%)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {type === "fixed" ? "Discount Amount ($) *" : "Discount Percentage (%) *"}
        </label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          disabled={loading}
          min="0"
          step={type === "fixed" ? "0.01" : "1"}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={type === "fixed" ? "e.g., 10.00" : "e.g., 20"}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Order Amount ($)
        </label>
        <input
          type="number"
          value={minOrderAmount}
          onChange={(e) => setMinOrderAmount(e.target.value)}
          disabled={loading}
          min="0"
          step="0.01"
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g., 50.00"
        />
        <p className="text-xs text-gray-500 mt-1">Leave as 0 for no minimum</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date
        </label>
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          disabled={loading}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Usage Limit
          </label>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            disabled={loading}
            min="1"
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Unlimited"
          />
          <p className="text-xs text-gray-500 mt-1">Empty = unlimited</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Per User Limit *
          </label>
          <input
            type="number"
            value={perUserLimit}
            onChange={(e) => setPerUserLimit(e.target.value)}
            disabled={loading}
            min="1"
            className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., 1"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        )}
        {loading ? "Saving..." : "Save Promo Code"}
      </button>
    </form>
  );
}
