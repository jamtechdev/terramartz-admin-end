import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const settingsService = {
  getAdminSettings,
  updateAdminSettings,
};

async function getAdminSettings(token?: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/settings`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    });

    return {
      success: true as const,
      data: response.data?.data || {},
    };
  } catch (error) {
    return handleApiError(error);
  }
}

async function updateAdminSettings(
  payload: { loyaltyPointValue: number },
  token?: string,
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/settings`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data?.data || {},
      message: response.data?.message || "Settings updated successfully",
    };
  } catch (error) {
    return handleApiError(error);
  }
}
