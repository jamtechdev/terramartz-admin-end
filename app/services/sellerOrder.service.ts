export const sellerOrderService = {
    /**
     * Get all sellers with order stats
     */
    getSellersWithStats: async (
        page: number = 1,
        limit: number = 10,
        search: string = "",
        token: string
    ) => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search.trim(),
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/seller-orders/sellers?${queryParams.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || "Failed to fetch sellers" };
            }

            return { success: true, data };
        } catch (error: any) {
            return { success: false, message: error.message || "Something went wrong" };
        }
    },

    /**
     * Get orders for a specific seller
     */
    getSellerOrders: async (
        sellerId: string,
        page: number = 1,
        limit: number = 10,
        search: string = "",
        status: string = "",
        paymentStatus: string = "",
        token: string
    ) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search.trim(),
                status: status,
                paymentStatus: paymentStatus,
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/seller-orders/${sellerId}/orders?${query.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || "Failed to fetch seller orders" };
            }

            return { success: true, data };
        } catch (error: any) {
            return { success: false, message: error.message || "Something went wrong" };
        }
    },
};
