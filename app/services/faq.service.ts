import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Faq {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FaqResponse {
    status: string;
    results: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: Faq[];
}

interface GetAllParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: string | boolean;
    token: string;
}

export const faqService = {
    adminGetAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};

async function adminGetAllFaqs({
    page = 1,
    limit = 10,
    search = "",
    isActive = "all",
    token,
}: GetAllParams): Promise<FaqResponse> {
    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(isActive !== "all" && { isActive: String(isActive) }),
    }).toString();

    const response = await axios.get(`${BASE_URL}/api/faqs/admin/all?${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

async function createFaq(
    data: { question: string; answer: string; isActive?: boolean },
    token: string
) {
    const response = await axios.post(`${BASE_URL}/api/faqs`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

async function updateFaq(
    id: string,
    data: { question?: string; answer?: string; isActive?: boolean },
    token: string
) {
    const response = await axios.patch(`${BASE_URL}/api/faqs/${id}`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

async function deleteFaq(id: string, token: string) {
    const response = await axios.delete(`${BASE_URL}/api/faqs/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}
