"use client";

import BlogCard from "./BlogCard";

type Blog = {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
};

const dummyBlogs: Blog[] = [
  { id: 1, title: "10 Tips for Fresh Fruits Supply", summary: "Learn how to manage your fruit supply efficiently.", author: "John Doe", date: "2025-12-01" },
  { id: 2, title: "Vegetable Market Trends 2025", summary: "Insights into vegetable demand and pricing trends.", author: "Jane Smith", date: "2025-12-05" },
  { id: 3, title: "Sustainable Farming Practices", summary: "Eco-friendly farming techniques to increase yield.", author: "Mike Johnson", date: "2025-12-10" },
];

export default function BlogList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyBlogs.map((blog) => (
        <BlogCard key={blog.id} {...blog} />
      ))}
    </div>
  );
}
