"use client";

type BlogCardProps = {
  title: string;
  summary: string;
  author: string;
  date: string;
};

export default function BlogCard({ title, summary, author, date }: BlogCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition cursor-pointer">
      <h2 className="text-xl font-bold text-green-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{summary}</p>
      <div className="text-sm text-gray-500 flex justify-between">
        <span>{author}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}
