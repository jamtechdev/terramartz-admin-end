"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { blogCategoryService } from "../../services/blog-category.service";
import { BlogCategory, BlogFilters } from "../../types/blog";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [totalPages, setTotalPages] = useState(0);

  const isSuperAdmin = user?.role === "Super Admin";

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await blogCategoryService.getCategories(filters, token || undefined);
      setCategories(response.categories || []);
      setTotalPages(Math.ceil((response.total || 0) / (filters.limit || 10)));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
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

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <RiSearchLine className="absolute left-3 top-3 text-gray-400" size={16} />
          <Input
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="pl-10"
          />
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
