"use client";

import CategoryForm from "./CategoryForm";

export default function CategoryModal({
  category,
  loading,
  onClose,
  onSave,
}: {
  category: any;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; image: File | null }) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl text-black font-bold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <CategoryForm
          initialData={{
            name: category?.name,
            description: category?.description,
            existingImage: category?.image,
          }}
          onSubmit={onSave}
          loading={loading}
        />
        <button
          onClick={onClose}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
