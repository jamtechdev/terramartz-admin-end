import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminLoginPayload = {
  email: string;
  password: string;
};

export const authService = {
  adminLogin,
  getAdminMe,
};

async function adminLogin(payload: AdminLoginPayload) {
  const response = await axios.post(
    `${BASE_URL}/api/admin/auth/login`,
    // `${BASE_URL}/api/admin/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

async function getAdminMe(token: string) {
  const response = await axios.get(`${BASE_URL}/api/admin/auth/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
