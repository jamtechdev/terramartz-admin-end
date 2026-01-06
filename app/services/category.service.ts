import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoriesService = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};

// ======================
// GET ALL CATEGORIES
// ======================
async function getCategories(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
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
  data: { name: string },
  token: string
) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/categories`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
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
  data: { name: string },
  token: string
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/categories/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
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
async function deleteCategory(
  id: string,
  token: string
) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
