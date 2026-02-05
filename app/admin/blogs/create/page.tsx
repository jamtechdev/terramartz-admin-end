"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { blogService } from "../../../services/blog.service";
import { blogCategoryService } from "../../../services/blog-category.service";
import { mediaService } from "../../../services/media.service";
import { BlogCategory, CreateBlogPayload } from "../../../types/blog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { Card } from "../../../components/ui/card";
import { RiSaveLine, RiArrowLeftLine, RiImageLine } from "react-icons/ri";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

export default function CreateBlogPage() {
  const { token, hasPermission, user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState<CreateBlogPayload>({
    title: "",
    shortDescription: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: [],
    status: "draft",
    seoTitle: "",
    seoDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const canManageBlogs = user?.role === "Super Admin" || hasPermission("Blogs", "Full");

  useEffect(() => {
    if (canManageBlogs) {
      fetchCategories();
    }
  }, [canManageBlogs]);

  const fetchCategories = async () => {
    try {
      const response = await blogCategoryService.getCategories({ status: "active" }, token || undefined);
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length > 200) newErrors.title = "Title must be less than 200 characters";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (formData.shortDescription.length > 300) newErrors.shortDescription = "Short description must be less than 300 characters";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (formData.content.length < 10) newErrors.content = "Content must be at least 10 characters";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.featuredImage) newErrors.featuredImage = "Featured image is required";
    if (formData.seoTitle && formData.seoTitle.length > 60) newErrors.seoTitle = "SEO title must be less than 60 characters";
    if (formData.seoDescription && formData.seoDescription.length > 160) newErrors.seoDescription = "SEO description must be less than 160 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, featuredImage: "Please select a valid image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, featuredImage: "Image size must be less than 5MB" });
      return;
    }

    try {
      setImageUploading(true);
      const response = await mediaService.uploadImage(file, token || undefined);
      setFormData({ ...formData, featuredImage: response.data.url });
      setErrors({ ...errors, featuredImage: "" });
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors({ ...errors, featuredImage: "Failed to upload image" });
    } finally {
      setImageUploading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, validating...');
    console.log('Form data:', formData);
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Validation errors:', errors);
    
    if (!isValid) {
      console.log('Form validation failed, not submitting');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting blog data:', formData);
      const result = await blogService.createBlog(formData, token || undefined);
      console.log('Blog created successfully:', result);
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canManageBlogs) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have permission to create blog posts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader title="Blog Post" />
        <button
          onClick={() => router.back()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Blog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief description of the blog post"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${errors.shortDescription ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content * (min 10 characters)</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={10}
                className={`w-full px-3 py-2 border rounded-md ${errors.content ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories && categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image *</Label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <RiImageLine size={16} />
                  {imageUploading ? "Uploading..." : "Choose Image"}
                </label>
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
              {errors.featuredImage && <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>}
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </Card>

        {/* SEO Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="SEO optimized title"
                className={errors.seoTitle ? "border-red-500" : ""}
              />
              {errors.seoTitle && <p className="text-red-500 text-sm mt-1">{errors.seoTitle}</p>}
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="SEO meta description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${errors.seoDescription ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>}
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading || imageUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            <RiSaveLine className="mr-2" size={16} />
            {loading ? "Creating..." : "Create Blog Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}