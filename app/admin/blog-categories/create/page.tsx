"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { blogCategoryService } from "../../../services/blog-category.service";
import { CreateCategoryPayload } from "../../../types/blog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { RiSaveLine, RiArrowLeftLine } from "react-icons/ri";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function CreateCategoryPage() {
  const { token, hasPermission, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const canManageBlogs = user?.role === "Super Admin" || hasPermission("Blogs", "Full");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length > 100) newErrors.name = "Name must be less than 100 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await blogCategoryService.createCategory(formData, token || undefined);
      router.push("/admin/blog-categories");
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!canManageBlogs) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have permission to create categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <RiArrowLeftLine size={16} />
        </Button>
        <DashboardHeader title="Create Category" />
        {/* <h1 className="text-2xl font-bold text-gray-900">Create Category</h1> */}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card className="p-6">
          <div className="space-y-4">
<div>
              <Label htmlFor="name">Name *</Label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className={`w-full px-4 py-2.5 bg-white border text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <RiSaveLine className="mr-2" size={16} />
            {loading ? "Creating..." : "Create Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}