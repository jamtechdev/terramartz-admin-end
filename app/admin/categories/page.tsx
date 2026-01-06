/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryModal from "@/app/components/admin/categories/CategoryModal";
import CategoryTable from "@/app/components/admin/categories/CategoryTable";
import { categoriesService } from "@/app/services/category.service";
import DeleteConfirmModal from "@/app/components/common/DeleteConfirmModal";
import { toast } from "react-toastify";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export type Category = {
  _id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { token } = useAuth();
  const router = useRouter();

  // ======================
  // FETCH CATEGORIES
  // ======================
  const fetchCategories = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    const res = await categoriesService.getCategories(token);

    if (!res.success) {
      toast.error(res.message);

      if (res.statusCode === 401) {
        router.push("/admin/login");
      }

      setLoading(false);
      return;
    }

    setCategories(res.data.categories || []);
    setLoading(false);
  }, [token, router]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ======================
  // ADD
  // ======================
  const handleAdd = () => {
    setEditCategory(null);
    setOpen(true);
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setOpen(true);
  };

  // ======================
  // SAVE (ADD / UPDATE)
  // ======================
  const handleSave = async (name: string) => {
    if (!token) return;

    let res;

    if (editCategory) {
      res = await categoriesService.updateCategory(
        editCategory._id,
        { name },
        token
      );
    } else {
      res = await categoriesService.addCategory({ name }, token);
    }

    if (!res.success) {
      toast.error(res.message);

      // if (res.statusCode === 401) {
      //   router.push("/admin/login");
      // }

      return;
    }

    toast.success(
      editCategory
        ? "Category updated successfully."
        : "Category added successfully."
    );

    setOpen(false);
    fetchCategories();
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId || !token) return;

    setDeleting(true);

    const res = await categoriesService.deleteCategory(deleteId, token);

    if (!res.success) {
      toast.error(res.message);

      if (res.statusCode === 401) {
        router.push("/admin/login");
      }

      setDeleting(false);
      setDeleteId(null);
      return;
    }

    toast.success("Category deleted successfully.");
    setDeleting(false);
    setDeleteId(null);
    fetchCategories();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader title="Categories" />
        <button
          onClick={handleAdd}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {open && (
        <CategoryModal
          category={editCategory}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Category"
        message="This action cannot be undone. Are you sure?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
