/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { userService } from "@/app/services/user.service";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { EditUserModal } from "./EditUserModal";
import { SellerDetailsModal } from "./SellerDetailsModal";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  date: string;
};

export const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const { token } = useAuth();
  const router = useRouter();

  const fetchUsers = async (
    pageNum = page,
    searchTerm = search,
    roleTerm = roleFilter,
    statusTerm = statusFilter,
  ) => {
    if (!token) return;

    setLoading(true);
    setError("");

    const res = await userService.getAllUsers(
      pageNum,
      limit,
      searchTerm.trim(),
      roleTerm,
      statusTerm,
      token,
    );

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    const mappedUsers: User[] = res.data.users.map((user: any) => ({
      _id: user._id,
      name: user.name || "N/A",
      email: user.email || "N/A",
      phoneNumber: user.phoneNumber || "N/A",
      isActive: user.isActive !== undefined ? user.isActive : true,
      role:
        user.role === "user"
          ? "Buyer"
          : user.role === "seller"
            ? "Seller"
            : user.role || "N/A",
      date: user.date || "",
    }));

    setUsers(mappedUsers);
    const total = res.data.total || 0;
    setTotalPages(Math.ceil(total / limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search, roleFilter, statusFilter);
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
    fetchUsers(1, "", "", "");
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewSellerDetails = (user: User) => {
    setSelectedUser(user);
    setShowSellerModal(true);
  };

  const handleToggleStatus = async (id: string) => {
    if (!token) return;
    setLoading(true);
    const res = await userService.toggleIsActive(id, token);
    setLoading(false);
    if (res.success) {
      fetchUsers(page, search, roleFilter, statusFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleUpdateUser = async (updateData: any) => {
    if (!token || !selectedUser) return;

    setLoading(true);
    const res = await userService.updateUserDetails(
      selectedUser._id,
      updateData,
      token,
    );
    setLoading(false);
    if (res.success) {
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers(page, search, roleFilter, statusFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleToggleRole = async (id: string) => {
    if (!token) return;
    setLoading(true);
    const user = users.find((u) => u._id === id);
    const newRole = user?.role === "Buyer" ? "seller" : "user";
    const res = await userService.updateUserRole(id, newRole, token);
    setLoading(false);
    if (res.success) {
      fetchUsers(page, search, roleFilter, statusFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    const res = await userService.deleteUser(id, token);
    setLoading(false);
    if (res.success) {
      fetchUsers(page, search, roleFilter, statusFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "dd MMM yyyy");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-wrap items-center gap-3"
      >
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[240px] text-sm transition-colors"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
        >
          <option value="">All Roles</option>
          <option value="user">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
        >
          <option value="">All Status</option>
          <option value="online">Active</option>
          <option value="offline">Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm"
        >
          Filter
        </button>

        {(search || roleFilter || statusFilter) && (
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Phone</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Role</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Loader />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center text-red-600 py-6">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-700">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(user.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-green-700 hover:text-green-800 text-xs font-semibold hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      {user.role === "Seller" && (
                        <button
                          onClick={() => handleViewSellerDetails(user)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-semibold hover:underline transition-colors"
                        >
                          View Details
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className="text-amber-600 hover:text-amber-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </button>
                      {/* <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        Delete
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 text-gray-700">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>

        <span className="px-3 py-1 text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSave={handleUpdateUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showSellerModal && selectedUser && (
        <SellerDetailsModal
          userId={selectedUser._id}
          onClose={() => {
            setShowSellerModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
