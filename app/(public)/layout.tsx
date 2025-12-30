// app/(public)/layout.tsx
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "TerraMartz",
  description: "TerraMartz Public Pages",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-green-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/">
            <h1 className="text-xl font-bold text-green-800">TerraMartz</h1>
          </Link>
          <nav>
            <ul className="flex gap-6 text-gray-700">
              <li>
                <Link href="/blog" className="hover:text-green-800">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-800">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-800">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="container mx-auto p-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} TerraMartz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
