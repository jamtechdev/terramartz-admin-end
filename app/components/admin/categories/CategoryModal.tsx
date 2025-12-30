"use client";

import CategoryForm from "./CategoryForm";


export default function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <CategoryForm
          initialName={category?.name}
          onSubmit={onSave}
        />

        <button
          onClick={onClose}
          className="mt-4 text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
