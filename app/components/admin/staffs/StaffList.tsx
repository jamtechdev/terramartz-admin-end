/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { adminAccountService } from "@/app/services/adminAccount.service";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { CreateStaffModal } from "./CreateStaffModal";
import { Admin } from "@/app/types/admin-staff";
import { EditStaffModal } from "./EditStaffModal";

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
);

// Plus icon component
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function StaffList() {
  const [staffs, setStaffs] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Admin | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const { token } = useAuth();
  const router = useRouter();

  const fetchStaffs = async (
    pageNum = page,
    searchTerm = search,
    roleTerm = roleFilter,
  ) => {
    if (!token) return;

    setLoading(true);
    setError("");

    const res = await adminAccountService.getAllAdmins(
      pageNum,
      limit,
      searchTerm.trim(),
      roleTerm,
      token,
    );

    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setStaffs(res.data.data.admins);
    const total = res.data.total || 0;
    setTotalPages(Math.ceil(total / limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchStaffs();
  }, [page]);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchStaffs(1, search, roleFilter);
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("");
    setPage(1);
    fetchStaffs(1, "", "");
  };

  const handleEdit = (staff: Admin) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (id: string) => {
    if (!token) return;
    setLoading(true);
    const res = await adminAccountService.toggleStaffStatus(id, token);
    setLoading(false);
    if (res.success) {
      fetchStaffs(page, search, roleFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    setLoading(true);
    const res = await adminAccountService.deleteStaff(id, token);
    setLoading(false);
    if (res.success) {
      fetchStaffs(page, search, roleFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleUpdateStaff = async (updateData: any) => {
    if (!token || !selectedStaff) return;

    setLoading(true);
    const res = await adminAccountService.updateStaff(
      selectedStaff._id,
      updateData,
      token,
    );
    setLoading(false);
    if (res.success) {
      setShowEditModal(false);
      setSelectedStaff(null);
      fetchStaffs(page, search, roleFilter);
    } else {
      alert(`Error: ${res.message}`);
    }
  };

  const handleCreateStaff = async (staffData: any) => {
    if (!token) return;

    setLoading(true);
    const res = await adminAccountService.createStaff(staffData, token);
    setLoading(false);
    if (res.success) {
      setShowCreateModal(false);
      fetchStaffs(page, search, roleFilter);
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
      {/* Header section with title and Add Staff button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 hover:shadow-lg hover:shadow-green-700/30 transition-all duration-200 font-medium text-sm"
        >
          <PlusIcon />
          Add Staff
        </button>
      </div>

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
          <option value="Super Admin">Super Admin</option>
          <option value="Ops">Ops</option>
          <option value="Finance">Finance</option>
          <option value="Logistics">Logistics</option>
          <option value="Support">Support</option>
          <option value="Read-Only">Read-Only</option>
        </select>

        <button
          type="submit"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm"
        >
          Filter
        </button>

        {(search || roleFilter) && (
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
              <th className="px-6 py-4 text-left font-semibold">Created</th>
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
            ) : staffs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-700">
                  No staff found
                </td>
              </tr>
            ) : (
              staffs.map((staff, index) => (
                <tr
                  key={staff._id}
                  className={`transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {staff.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        staff.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {staff.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(staff.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="text-green-700 hover:text-green-800 text-xs font-semibold hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(staff._id)}
                        className="text-amber-600 hover:text-amber-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        {staff.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold hover:underline transition-colors"
                      >
                        Delete
                      </button>
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

      {showEditModal && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          onSave={handleUpdateStaff}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {showCreateModal && (
        <CreateStaffModal
          onSave={handleCreateStaff}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
