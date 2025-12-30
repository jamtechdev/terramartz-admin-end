/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CategoryModal from "@/app/components/admin/categories/CategoryModal";
import CategoryTable from "@/app/components/admin/categories/CategoryTable";
import { useState } from "react";

const mockCategories = [
  { id: "1", name: "Fruits" },
  { id: "2", name: "Vegetables" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<unknown>(null);

  const handleAdd = () => {
    setEditCategory(null);
    setOpen(true);
  };

  const handleEdit = (cat: any) => {
    setEditCategory(cat);
    setOpen(true);
  };

  const handleSave = (name: string) => {
    if (editCategory) {
      setCategories(
        categories.map((c) => (c.id === editCategory.id ? { ...c, name } : c))
      );
    } else {
      setCategories([...categories, { id: Date.now().toString(), name }]);
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>
      </div>

      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {open && (
        <CategoryModal
          category={editCategory}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
