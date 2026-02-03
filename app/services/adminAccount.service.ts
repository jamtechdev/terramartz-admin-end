/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminAccountService = {
  getAllAdmins,
  getAdminById,
  updateStaff,
  toggleStaffStatus,
  deleteStaff,
  createStaff,
};

// ======================
// GET ALL ADMINS
// ======================
async function getAllAdmins(
  page = 1,
  limit = 10,
  search = "",
  role = "",
  token?: string,
) {
  try {
    const params: any = { page, limit };

    if (search) params.search = search;
    if (role) params.role = role;

    const response = await axios.get(`${BASE_URL}/api/admin/accounts`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      params,
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// GET ADMIN BY ID
// ======================
async function getAdminById(id: string, token?: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/accounts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// UPDATE STAFF
// ======================
async function updateStaff(id: string, updateData: any, token?: string) {
  try {
    const response = await axios.patch(`${BASE_URL}/api/admin/accounts/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// TOGGLE STAFF STATUS
// ======================
async function toggleStaffStatus(id: string, token?: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/accounts/${id}/toggle`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// CREATE STAFF
// ======================
async function createStaff(staffData: any, token?: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/auth/register`, staffData, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// ======================
// DELETE STAFF
// ======================
async function deleteStaff(id: string, token?: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/accounts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
