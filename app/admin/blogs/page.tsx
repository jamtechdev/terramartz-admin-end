"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { blogService } from "../../services/blog.service";
import { BlogPost, BlogFilters } from "../../types/blog";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { 
  RiAddLine, 
  RiSearchLine, 
  RiEditLine, 
  RiDeleteBinLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiToggleLine
} from "react-icons/ri";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function BlogsPage() {
  const { token, hasPermission, user } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });
  const [totalPages, setTotalPages] = useState(0);

  const isSuperAdmin = user?.role === "Super Admin";
  const sanitizeImageUrl = (url?: string) => {
    const cleaned = (url || "")
      .trim()
      .replace(/[`'"]/g, "")
      .replace(/[()]/g, "");
    return cleaned;
  };

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogs(filters, token || undefined);
      setBlogs(response.blogs || []);
      setTotalPages(Math.ceil((response.total || 0) / (filters.limit || 10)));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (blogId: string, status: 'published' | 'draft') => {
    try {
      if (status === 'published') {
        await blogService.publishBlog(blogId, token || undefined);
      } else {
        await blogService.unpublishBlog(blogId, token || undefined);
      }
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog status:", error);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await blogService.deleteBlog(blogId, token || undefined);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeader title="Blog Posts" />
        {/* <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1> */}
        {isSuperAdmin && (
          <Link href="/admin/blogs/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <RiAddLine className="mr-2" size={16} />
              Create Blog Post
            </Button>
          </Link>
        )}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[240px] text-sm transition-colors"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Blog List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs && blogs.length > 0 ? blogs.map((blog) => (
            <Card key={blog._id} className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  {sanitizeImageUrl(blog.featuredImage) ? (
                    <img
                      src={sanitizeImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-md" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{blog.shortDescription}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {blog.category?.name || 'No Category'}</span>
                    <span>Author: {blog.author?.name || 'Unknown'}</span>
                    <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/blogs/${blog._id}`}>
                    <Button variant="outline" size="sm">
                      <RiEyeLine size={16} />
                    </Button>
                  </Link>
                  {isSuperAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(blog._id, blog.status === 'published' ? 'draft' : 'published')}
                        className={blog.status === 'published' ? 'text-orange-600' : 'text-green-600'}
                      >
                        <RiToggleLine size={20} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={filters.page === page ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ ...filters, page })}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
