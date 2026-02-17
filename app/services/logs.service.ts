import axios from "axios";
import { handleApiError } from "../utils/handleApiError";
import type {
  LogsResponse,
  AvailableLogDatesResponse,
} from "../types/logs.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get available log dates
 */
async function getAvailableLogDates(token: string) {
  try {
    const response = await axios.get<AvailableLogDatesResponse>(
      `${BASE_URL}/api/admin/logs/dates/available`,
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

/**
 * Get logs by specific date
 */
async function getLogsByDate(
  token: string,
  date: string,
  params?: {
    page?: number;
    limit?: number;
    method?: string;
    status?: string;
    adminEmail?: string;
  }
) {
  try {
    const response = await axios.get<LogsResponse>(
      `${BASE_URL}/api/admin/logs/${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
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

/**
 * Get all logs with date range filter
 */
async function getAllLogs(
  token: string,
  params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    method?: string;
    status?: string;
    adminEmail?: string;
  }
) {
  try {
    const response = await axios.get<LogsResponse>(
      `${BASE_URL}/api/admin/logs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
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

export const logsService = {
  getAvailableLogDates,
  getLogsByDate,
  getAllLogs,
};
