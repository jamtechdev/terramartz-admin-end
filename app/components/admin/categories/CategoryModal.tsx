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
        <h2 className="text-xl text-black font-bold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <CategoryForm
          initialName={category?.name}
          onSubmit={onSave}
        />
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition w-full mt-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
