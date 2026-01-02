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
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah@example.com",
    role: "Manager",
    status: "Active",
  },
];

export default function UserList() {
  return (
    <div className="overflow-y-hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-green-700">
            <th className="px-6 py-4 text-left font-semibold text-white">
              Name
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white">
              Email
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white">
              Role
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white">
              Status
            </th>
            <th className="px-6 py-4 text-left font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {dummyUsers.map((user, index) => (
            <tr
              key={user.id}
              className={`transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-green-50`}
            >
              <td className="px-6 py-4 text-gray-700">{user.name}</td>
              <td className="py-3 px-4 text-gray-700">{user.email}</td>
              <td className="px-6 py-4 text-gray-700">{user.role}</td>
              <td className="px-6 py-4">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Edit
                </Link>

                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition">
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
