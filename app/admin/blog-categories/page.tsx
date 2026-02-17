"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { blogCategoryService } from "../../services/blog-category.service";
import { BlogCategory, BlogFilters } from "../../types/blog";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { 
  RiAddLine, 
  RiSearchLine, 
  RiEditLine, 
  RiDeleteBinLine,
  RiToggleLine
} from "react-icons/ri";

export default function BlogCategoriesPage() {
  const { token, hasPermission, user } = useAuth();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    results: 0,
  });
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 5,
    search: "",
  });

  const isSuperAdmin = user?.role === "Super Admin";

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await blogCategoryService.getCategories(filters, token || undefined);
      setCategories(response.categories || []);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        results: response.results,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const lastPage = Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 5)));
    if (newPage > lastPage) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusToggle = async (categoryId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await blogCategoryService.updateCategory(categoryId, { status: newStatus }, token || undefined);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await blogCategoryService.deleteCategory(categoryId, token || undefined);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeader title="Blog Categories" />
        {/* <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1> */}
        {isSuperAdmin && (
          <Link href="/admin/blog-categories/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <RiAddLine className="mr-2" size={16} />
              Create Category
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
              placeholder="Search categories..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[240px] text-sm transition-colors"
            />
          </div>
        </div>
      </Card>

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories && categories.length > 0 ? categories.map((category) => (
            <Card key={category._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                      {category.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Slug: {category.slug}</span>
                    <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSuperAdmin && (
                    <>
                      <Link href={`/admin/blog-categories/${category._id}`}>
                        <Button variant="outline" size="sm">
                          <RiEditLine size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(category._id, category.status)}
                        className={category.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                      >
                        <RiToggleLine size={20} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
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
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {pagination.page} of {Math.max(1, Math.ceil(pagination.total / pagination.limit))}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= Math.max(1, Math.ceil(pagination.total / pagination.limit))}
          className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
