import axios from "axios";
import { MediaUploadResponse } from "../types/blog";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const mediaService = {
  uploadImage,
};

async function uploadImage(file: File, token?: string): Promise<MediaUploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(
    `${BASE_URL}/api/admin/media/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}