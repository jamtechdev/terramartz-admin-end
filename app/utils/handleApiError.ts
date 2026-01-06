import axios from "axios";

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      success: false as const,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Request failed",
      statusCode: error.response?.status || 500,
    };
  }

  return {
    success: false as const,
    message: "Unexpected error occurred",
    statusCode: 500,
  };
}
