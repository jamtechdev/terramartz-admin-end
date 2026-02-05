"use client";

import { useState, useEffect } from "react";

export default function CategoryForm({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: {
    name?: string;
    description?: string;
    image?: File | null;
    existingImage?: string;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    image: File | null;
  }) => void;
  loading?: boolean;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [image, setImage] = useState<File | null>(initialData?.image || null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.existingImage || null,
  );

  useEffect(() => {
    if (initialData?.existingImage) {
      setImagePreview(initialData.existingImage);
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={loading}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter category description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Image
        </label>
        <div className="flex items-center gap-4 min-w-0">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 disabled:opacity-50 overflow-hidden">
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex-shrink-0">
                Choose File
              </span>
              <span className="text-sm text-gray-500 truncate min-w-0">
                {image ? image.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        )}
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
