/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { userService } from "@/app/services/user.service";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
  role: string;
  date: string;
};

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const { token } = useAuth();
  const router = useRouter();

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async (
    pageNum = page,
    searchTerm = search,
    roleTerm = roleFilter,
  ) => {
    if (!token) return;

    setLoading(true);
    setError("");

    const res = await userService.getAllUsers(
      pageNum,
      limit,
      searchTerm.trim(),
      roleTerm,
      token,
    );

    if (!res.success) {
      setError(res.message);

      // if (res.statusCode === 401) {
      //   router.push("/admin/login");
      // }

      setLoading(false);
      return;
    }

    const mappedUsers: User[] = res.data.users.map((user: any) => ({
      _id: user._id,
      name: user.name || "N/A",
      email: user.email || "N/A",
      phoneNumber: user.phoneNumber || "N/A",
      status: user.status === "offline" ? "Inactive" : "Active",
      role:
        user.role === "user"
          ? "Buyer"
          : user.role === "seller"
            ? "Seller"
            : "N/A",
      date: user.date || "",
    }));

    setUsers(mappedUsers);
    setTotalPages(Math.ceil(res.data.total / limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ======================
  // FILTERS
  // ======================
  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search, roleFilter);
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("");
    setPage(1);
    fetchUsers(1, "", "");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "dd MMM yyyy");
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-wrap items-center gap-2 w-full"
      >
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 border rounded-lg focus:outline-none focus:border-green-500 min-w-[200px]"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-white border-black/30 text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="">All Roles</option>
          <option value="seller">Seller</option>
          <option value="user">Buyer</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          Filter
        </button>

        {(search || roleFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        )}
      </form>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <Loader />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-red-600 py-6">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.phoneNumber}
                  </td>
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
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(user.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex items-center justify-end gap-2 mt-4 text-black">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="bg-green-700 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="bg-green-700 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
