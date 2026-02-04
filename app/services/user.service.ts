/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  getAllUsers,
  getUserById,
  toggleIsActive,
  updateUserRole,
  updateUserDetails,
  deleteUser,
};

// ======================
// GET ALL USERS
// ======================
async function getAllUsers(
  page = 1,
  limit = 5,
  search = "",
  role = "",
  status = "",
  token?: string
) {
  try {
    const params: any = { page, limit };

    if (search) params.search = search;
    if (role) params.role = role;
    if (status) params.status = status;

    const response = await axios.get(
      `${BASE_URL}/api/admin/users`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        params,
        withCredentials: true,
      }
    );

    return {
      success: true as const,
      data: response.data, // { users, total, page, limit }
    };
  } catch (error) {
return handleApiError(error);
  }
}

// ======================
// GET USER BY ID
// ======================
async function getUserById(id: string, token?: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/users/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
// TOGGLE USER ISACTIVE STATUS
// ======================
async function toggleIsActive(id: string, token?: string) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/users/${id}/isActive`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
// UPDATE USER ROLE
// ======================
async function updateUserRole(id: string, role: string, token?: string) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/users/${id}/role`,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
// UPDATE USER DETAILS
// ======================
async function updateUserDetails(id: string, updateData: any, token?: string) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/users/${id}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
// DELETE USER
// ======================
async function deleteUser(id: string, token?: string) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/users/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
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
