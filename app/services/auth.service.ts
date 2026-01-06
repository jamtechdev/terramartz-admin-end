import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminLoginPayload = {
  email: string;
  password: string;
};

export const authService = {
  adminLogin,
};

async function adminLogin(payload: AdminLoginPayload) {
  const response = await axios.post(
    `${BASE_URL}/api/admin/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
