"use client";

export default function DashboardHeader({ title }: { title: string }) {
  return <h1 className="xl:text-4xl text-3xl font-bold text-green-700 mb-4">{title}</h1>;
}
