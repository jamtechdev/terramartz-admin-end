"use client";

import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

const dummyUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Sarah Lee", email: "sarah@example.com", role: "Manager", status: "Active" },
];

export default function UserList() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Users</h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {dummyUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-green-50 transition-colors"
            >
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4 text-gray-600">{user.email}</td>
              <td className="py-3 px-4">{user.role}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-4 flex gap-2">
                {/* Dynamic Edit Link */}
                <Link
                  href={`/admin/users/${user.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Edit
                </Link>

                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
