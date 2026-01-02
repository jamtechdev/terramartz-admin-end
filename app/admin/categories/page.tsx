"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryModal from "@/app/components/admin/categories/CategoryModal";
import CategoryTable from "@/app/components/admin/categories/CategoryTable";
import { categoriesService } from "@/app/services/category.service";
import DeleteConfirmModal from "@/app/components/common/DeleteConfirmModal";
import { toast } from "react-toastify";

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
  const [page, setPage] = useState(1);
  const LIMIT = 5; // categories per page

  // ======================
  // FETCH CATEGORIES
  // ======================
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoriesService.getCategories();

      if (res?.status === "success") {
        setCategories(res.categories || []);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  }, []);
  // const fetchCategories = useCallback(async () => {
  //   try {
  //     setLoading(true);

  //     const res = await categoriesService.getCategories(page, LIMIT);

  //     if (res?.status === "success") {
  //       setCategories(res.categories || []);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load categories", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [page]);

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
    try {
      if (editCategory) {
        const res = await categoriesService.updateCategory(editCategory._id, {
          name,
        });

        if (res?.status === "success") {
          toast.success("Category updated successfully.");
          fetchCategories();
        } else {
          toast.error("Unable to update category.");
        }
      } else {
        const res = await categoriesService.addCategory({ name });

        if (res?.status === "success") {
          toast.success("Category added successfully.");
          fetchCategories();
        } else {
          toast.error("Unable to add category.");
        }
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Something went wrong.");
    } finally {
      setOpen(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const res = await categoriesService.deleteCategory(deleteId);

      if (res?.status === "success") {
        toast.success("Category deleted successfully.");
        fetchCategories();
      } else {
        toast.error("Unable to delete category.");
      }
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
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
    </div>
  );
}
