"use client";

import { useState } from "react";

export default function CategoryForm({
  initialName = "",
  onSubmit,
}: {
  initialName?: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
        placeholder="Category name"
        required
      />

      <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold w-full">
        Save
      </button>
    </form>
  );
}
