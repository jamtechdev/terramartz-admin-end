export interface BlogCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  category: BlogCategory;
  tags: string[];
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface BlogsResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  results: number;
  blogs: BlogPost[];
}

export interface CategoriesResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  results: number;
  categories: BlogCategory[];
}

export interface CreateBlogPayload {
  title: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateCategoryPayload {
  name: string;
  status: 'active' | 'inactive';
}

export interface MediaUploadResponse {
  status: string;
  data: {
    url: string;
    filename: string;
    size: number;
  };
}