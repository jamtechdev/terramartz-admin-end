import axios from "axios";
import { BlogFilters, BlogsResponse, BlogPost, CreateBlogPayload } from "../types/blog";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const blogService = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  updateFullBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
};

async function getBlogs(filters: BlogFilters = {}, token?: string): Promise<BlogsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(
    `${BASE_URL}/api/admin/blogs?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  // Handle the actual API response structure
  const apiData = response.data;
  const page = typeof filters.page === 'number' ? filters.page : Number(apiData.page ?? 1);
  const limit = typeof filters.limit === 'number' ? filters.limit : Number(apiData.limit ?? 10);
  const results = Number(apiData.results ?? (apiData.data?.blogs?.length ?? 0));
  const total = Number(apiData.total ?? apiData.data?.total ?? results);
  return {
    status: apiData.status,
    page,
    limit,
    total,
    results,
    blogs: apiData.data?.blogs || []
  };
}

async function getBlogById(blogId: string, token?: string): Promise<{ status: string; data: BlogPost }> {
  const response = await axios.get(
    `${BASE_URL}/api/admin/blogs/${blogId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  // Handle the actual API response structure
  const apiData = response.data;
  return {
    status: apiData.status,
    data: apiData.data?.blog || apiData.data
  };
}

async function createBlog(data: CreateBlogPayload, token?: string) {
  const response = await axios.post(
    `${BASE_URL}/api/admin/blogs`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function updateBlog(blogId: string, data: Partial<CreateBlogPayload>, token?: string) {
  const response = await axios.patch(
    `${BASE_URL}/api/admin/blogs/${blogId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function deleteBlog(blogId: string, token?: string) {
  const response = await axios.delete(
    `${BASE_URL}/api/admin/blogs/${blogId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  return response.data;
}

async function publishBlog(blogId: string, token?: string) {
  return updateBlog(blogId, { status: 'published' }, token);
}

async function unpublishBlog(blogId: string, token?: string) {
  return updateBlog(blogId, { status: 'draft' }, token);
}

// Update the updateFullBlog function to be exported
async function updateFullBlog(blogId: string, data: CreateBlogPayload, token?: string) {
    const response = await axios.patch(`${BASE_URL}/api/admin/blogs/${blogId}/edit`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}
