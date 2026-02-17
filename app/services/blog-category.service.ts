import axios from "axios";
import { BlogFilters, CategoriesResponse, BlogCategory, CreateCategoryPayload } from "../types/blog";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const blogCategoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

async function getCategories(filters: BlogFilters = {}, token?: string): Promise<CategoriesResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(
    `${BASE_URL}/api/admin/blog-categories?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  // Handle the actual API response structure
  const apiData = response.data;
  const page = typeof filters.page === 'number' ? filters.page : Number(apiData.page ?? 5);
  const limit = typeof filters.limit === 'number' ? filters.limit : Number(apiData.limit ?? 5);
  const results = Number(apiData.results ?? (apiData.data?.categories?.length ?? 0));
  const total = Number(apiData.total ?? apiData.data?.total ?? results);
  return {
    status: apiData.status,
    page,
    limit,
    total,
    results,
    categories: apiData.data?.categories || []
  };
}

async function getCategoryById(categoryId: string, token?: string): Promise<{ status: string; data: BlogCategory }> {
  const response = await axios.get(
    `${BASE_URL}/api/admin/blog-categories/${categoryId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  // Handle the actual API response structure
  const apiData = response.data;
  return {
    status: apiData.status,
    data: apiData.data?.category || apiData.data
  };
}

async function createCategory(data: CreateCategoryPayload, token?: string) {
  const response = await axios.post(
    `${BASE_URL}/api/admin/blog-categories`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function updateCategory(categoryId: string, data: Partial<CreateCategoryPayload>, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/blog-categories/${categoryId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function deleteCategory(categoryId: string, token?: string) {
  const response = await axios.delete(
    `${BASE_URL}/api/admin/blog-categories/${categoryId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}
