/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  getAllUsers,
};

// ======================
// GET ALL USERS
// ======================
async function getAllUsers(
  page = 1,
  limit = 5,
  search = "",
  role = "",
  token?: string
) {
  try {
    const params: any = { page, limit };

    if (search) params.search = search;
    if (role) params.role = role;

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
