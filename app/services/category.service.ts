import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoriesService = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};

// ======================
// GET ALL CATEGORIES
// ======================
async function getCategories(
  token: string,
  page?: number,
  limit?: number,
  search?: string,
  statusFilter?: string,
) {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (statusFilter) params.append("status", statusFilter);

    const response = await axios.get(
      `${BASE_URL}/api/admin/categories?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// ADD CATEGORY
// ======================
async function addCategory(
  data: { name: string; description: string; image: File | null },
  token: string,
) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const response = await axios.post(
      `${BASE_URL}/api/admin/categories`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// UPDATE CATEGORY
// ======================
async function updateCategory(
  id: string,
  data: { name: string; description: string; image: File | null },
  token: string,
) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const response = await axios.patch(
      `${BASE_URL}/api/admin/categories/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// DELETE CATEGORY
// ======================
async function deleteCategory(id: string, token: string) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// TOGGLE CATEGORY STATUS
// ======================
async function toggleCategoryStatus(id: string, token: string) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/categories/${id}/toggle-is-active`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
