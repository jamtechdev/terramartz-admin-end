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
        className="w-full border p-2 rounded"
        placeholder="Category name"
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
}
