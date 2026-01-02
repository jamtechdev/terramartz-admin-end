/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const transactionService = {
  getAllTransactions,
};

// ======================
// GET ALL USER TRANSACTIONS
// ======================
/**
 * Fetch all transactions with pagination, search, and filters
 * @param page - page number
 * @param limit - items per page
 * @param search - search by buyer name or email
 * @param status - filter by transaction status
 * @param paymentStatus - filter by payment status
 * @returns { transactions: [], total: number }
 */
async function getAllTransactions(
  page = 1,
  limit = 5,
  search = "",
  status = "",
  paymentStatus = ""
) {
  try {
    const params: any = { page, limit };

    if (search) params.search = search;
    if (status) params.status = status;
    if (paymentStatus) params.paymentStatus = paymentStatus;

    const response = await axios.get(`${BASE_URL}/api/admin/user-transactions`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`, // uncomment if using auth
      },
      params,
    });

    // Expected API response: { transactions: [], total: number, page, limit }
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
}
