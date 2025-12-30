"use client";

import BlogList from "@/app/components/blog/BlogList";

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-700">Our Blog</h1>
      <BlogList />
    </div>
  );
}
