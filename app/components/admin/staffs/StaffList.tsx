/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { adminAccountService } from "@/app/services/adminAccount.service";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type AdminRole = "Super Admin" | "Ops" | "Finance" | "Logistics" | "Support" | "Read-Only";

type Admin = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: AdminRole;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

const Loader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
  </div>
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 w-full justify-between">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          Add Staff
        </button>
      </div>

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
          <option value="Super Admin">Super Admin</option>
          <option value="Ops">Ops</option>
          <option value="Finance">Finance</option>
          <option value="Logistics">Logistics</option>
          <option value="Support">Support</option>
          <option value="Read-Only">Read-Only</option>
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

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-left">Actions</th>
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
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{staff.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {staff.phoneNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {staff.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(staff.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(staff._id)}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-semibold"
                      >
                        {staff.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
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

function CreateStaffModal({
  onSave,
  onClose,
}: {
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: AdminRole;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Read-Only",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phoneNumber?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "Read-Only",
    });
    setErrors({});
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phoneNumber?: string; password?: string } = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 1) {
      newErrors.name = "Name must be at least 1 character";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be 10-15 digits, optionally with a + prefix";
      }
    }

    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 md:max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Staff</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              minLength={1}
              maxLength={50}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 ${
                errors.name ? "border-red-500" : "focus:border-green-500"
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 ${
                errors.email ? "border-red-500" : "focus:border-green-500"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
              }}
              placeholder="+1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 ${
                errors.phoneNumber ? "border-red-500" : "focus:border-green-500"
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 pr-10 ${
                  errors.password ? "border-red-500" : "focus:border-green-500"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as AdminRole })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Ops">Ops</option>
              <option value="Finance">Finance</option>
              <option value="Logistics">Logistics</option>
              <option value="Support">Support</option>
              <option value="Read-Only">Read-Only</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Create Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditStaffModal({
  staff,
  onSave,
  onClose,
}: {
  staff: Admin;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    phoneNumber: string;
    role: AdminRole;
  }>({
    name: staff.name,
    phoneNumber: staff.phoneNumber,
    role: staff.role as AdminRole,
  });
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; phoneNumber?: string; email?: string } = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 1) {
      newErrors.name = "Name must be at least 1 character";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be 10-15 digits, optionally with a + prefix";
      }
    }

    if (!staff.email || staff.email.trim() === "") {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staff.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Staff</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              minLength={1}
              maxLength={50}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 ${
                errors.name ? "border-red-500" : "focus:border-green-500"
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Email
            </label>
            <input
              type="email"
              value={staff.email}
              readOnly
              className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 bg-gray-100"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
              }}
              placeholder="+1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-900 ${
                errors.phoneNumber ? "border-red-500" : "focus:border-green-500"
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as AdminRole })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Ops">Ops</option>
              <option value="Finance">Finance</option>
              <option value="Logistics">Logistics</option>
              <option value="Support">Support</option>
              <option value="Read-Only">Read-Only</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
