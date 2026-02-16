import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProductFilters {
  search?: string;
  status?: string;
  productType?: string;
  category?: string;
  sellerId?: string;
  farmId?: string;
  minPrice?: number;
  maxPrice?: number;
  organic?: boolean;
  featured?: boolean;
  adminApproved?: boolean;
  page?: number;
  limit?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  category: {
    _id: string;
    name: string;
    description: string;
    slug: string;
  };
  stockQuantity: number;
  productImages: string[];
  tags: string[];
  organic: boolean;
  featured: boolean;
  productType: string;
  status: string;
  delivery: string;
  createdBy: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    role: string;
  };
  farmInfo?: {
    _id: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  farmId?: {
    _id: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  farmName?: string;
  discount: number;
  discountType: string;
  adminApproved?: boolean;
  approvedBy?: string;
  __v?: number;
}

export interface ProductsResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  results: number;
  products: Product[];
}

export const productService = {
  getProducts,
  getProductById,
  getRequestedProducts,
  approveProduct,
  rejectProduct,
  toggleProductApproval,
  updateProductStatus,
  exportProductsCSV,
};

async function getProducts(filters: ProductFilters = {}, token?: string): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(
    `${BASE_URL}/api/admin/products?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function getProductById(productId: string, token?: string): Promise<{ status: string; data: Product }> {
  const response = await axios.get(
    `${BASE_URL}/api/admin/products/${productId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function getRequestedProducts(token?: string): Promise<ProductsResponse> {
  const response = await axios.get(
    `${BASE_URL}/api/admin/products/requested`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function approveProduct(productId: string, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/products/${productId}/approval`,
    { approved: true },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function rejectProduct(productId: string, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/products/${productId}/approval`,
    { approved: false },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function toggleProductApproval(productId: string, approved: boolean, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/products/${productId}/approval`,
    { approved },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function updateProductStatus(productId: string, status: string, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/products/${productId}/status`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function exportProductsCSV(token?: string) {
  const response = await axios.get(
    `${BASE_URL}/api/admin/products/export/csv`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      responseType: 'blob',
    }
  );

  return response.data;
}