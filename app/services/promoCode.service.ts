import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PromoCode {
  _id: string;
  code: string;
  discount: number;
  expiresAt: string | null;
  minOrderAmount: number;
  type: "fixed" | "percentage";
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  usageLimit: number | null;
  perUserLimit: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodeResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  results: number;
  promoCodes: PromoCode[];
}

export interface PromoCodeUsage {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  purchase_id: {
    _id: string;
    totalAmount: number;
    status: string;
  } | null;
  createdAt: string;
}

export interface PromoCodeUsageResponse {
  status: string;
  totalUses: number;
  uniqueUsers: number;
  usageDetails: PromoCodeUsage[];
}

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  isActive?: string | boolean;
  token: string;
}

interface CreatePromoCodeData {
  code: string;
  discount: number;
  expiresAt?: string;
  minOrderAmount?: number;
  type: "fixed" | "percentage";
  isActive?: boolean;
  usageLimit?: number | null;
  perUserLimit?: number;
}

interface UpdatePromoCodeData {
  code?: string;
  discount?: number;
  expiresAt?: string | null;
  minOrderAmount?: number;
  type?: "fixed" | "percentage";
  isActive?: boolean;
  usageLimit?: number | null;
  perUserLimit?: number;
}

export const promoCodeService = {
  getAllPromoCodes,
  getPromoCode,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getPromoCodeUsage,
};

async function getAllPromoCodes({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  isActive = "",
  token,
}: GetAllParams): Promise<PromoCodeResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(type && { type }),
    ...(isActive !== "" && { isActive: String(isActive) }),
  }).toString();

  const response = await axios.get(
    `${BASE_URL}/api/admin/promo-code?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

async function getPromoCode(
  id: string,
  token: string,
): Promise<{ status: string; promoCode: PromoCode }> {
  const response = await axios.get(`${BASE_URL}/api/admin/promo-code/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function createPromoCode(
  data: CreatePromoCodeData,
  token: string,
): Promise<{ status: string; promoCode: PromoCode }> {
  const response = await axios.post(`${BASE_URL}/api/admin/promo-code`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function updatePromoCode(
  id: string,
  data: UpdatePromoCodeData,
  token: string,
): Promise<{ status: string; promoCode: PromoCode }> {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/promo-code/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

async function deletePromoCode(
  id: string,
  token: string,
): Promise<{ status: string; message: string }> {
  const response = await axios.delete(
    `${BASE_URL}/api/admin/promo-code/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

async function getPromoCodeUsage(
  id: string,
  token: string,
): Promise<PromoCodeUsageResponse> {
  const response = await axios.get(
    `${BASE_URL}/api/admin/promo-code/${id}/usage`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
