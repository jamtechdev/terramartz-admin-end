import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const dashboardService = {
  getSectionOne,
  getSectionTwo,
  getSectionThree,
  getSectionFour,
};

// ======================
//Section One
// ======================
async function getSectionOne(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/dashboard/section-one`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    console.log(response, "response==>");

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
// ======================
//Section two
// ======================
async function getSectionTwo(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/dashboard/section-two`,
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
//Section Three
// ======================
async function getSectionThree(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/dashboard/section-three`,
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
//Section Four
// ======================
async function getSectionFour(token: string) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/dashboard/section-four`,
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
