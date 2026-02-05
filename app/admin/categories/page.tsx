/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryModal from "@/app/components/admin/categories/CategoryModal";
import { categoriesService } from "@/app/services/category.service";
import DeleteConfirmModal from "@/app/components/common/DeleteConfirmModal";
import { toast } from "react-toastify";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  logo?: string;
  isActive?: boolean;
  createdAt?: string;
};

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const { token } = useAuth();
  const router = useRouter();

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    const res = await categoriesService.getCategories(
      token,
      page,
      limit,
      search.trim(),
      statusFilter,
    );

    if (!res.success) {
      toast.error(res.message);

      if (res.statusCode === 401) {
        router.push("/admin/login");
      }

      setLoading(false);
      return;
    }

    setCategories(res.data.categories || []);
    const totalCount = res.data.total || 0;
    setTotal(totalCount);
    setTotalPages(Math.ceil(totalCount / limit));
    setLoading(false);
  }, [token, router, page, limit, search, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = () => {
    setEditCategory(null);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!token) return;

    setSaving(true);
    setLoading(true);

    let res;

    if (editCategory) {
      res = await categoriesService.updateCategory(
        editCategory._id,
        data,
        token,
      );
    } else {
      res = await categoriesService.addCategory(data, token);
    }

    setSaving(false);
    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(
      editCategory
        ? "Category updated successfully."
        : "Category added successfully.",
    );

    setOpen(false);
    setEditCategory(null);
    fetchCategories();
  };

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

  const handleToggleStatus = async (id: string) => {
    if (!token) return;

    setLoading(true);
    const res = await categoriesService.toggleCategoryStatus(id, token);
    setLoading(false);

    if (res.success) {
      toast.success("Category status updated successfully.");
      fetchCategories();
    } else {
      toast.error(`Error: ${res.message}`);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "dd MMM yyyy");
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

      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[240px] text-sm transition-colors"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm"
        >
          Filter
        </button>

        {(search || statusFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-4 text-left font-semibold">Image</th>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Slug</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Created</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Loader />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-700">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category._id}
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {category.slug || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        category.isActive !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(category.createdAt || "")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-green-700 hover:text-green-800 text-xs font-semibold hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category._id)}
                        className="text-amber-600 hover:text-amber-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        {category.isActive !== false ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-gray-700">
        <span className="text-sm font-medium">
          Showing {categories.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
          {Math.min(page * limit, total)} of {total} categories
        </span>

        <div className="flex items-center justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {open && (
        <CategoryModal
          category={editCategory}
          loading={saving}
          onClose={() => {
            setOpen(false);
            setEditCategory(null);
          }}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Category"
        message="This action cannot be undone. Are you sure you want to delete this category?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
