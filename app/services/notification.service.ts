import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const notificationService = {
  getNotificationCounts,
};

async function getNotificationCounts(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/notifications/counts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return {
      success: true as const,
      data: response.data.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
