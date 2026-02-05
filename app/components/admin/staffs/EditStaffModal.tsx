import { Admin, AdminRole } from "@/app/types/admin-staff";
import { useState } from "react";

export function EditStaffModal({
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
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    email?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { name?: string; phoneNumber?: string; email?: string } =
      {};

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
        newErrors.phoneNumber =
          "Phone number must be 10-15 digits, optionally with a + prefix";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Staff</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
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
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors ${
                errors.name
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={staff.email}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 text-sm cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => {
                setFormData({ ...formData, phoneNumber: e.target.value });
                if (errors.phoneNumber)
                  setErrors({ ...errors, phoneNumber: undefined });
              }}
              placeholder="+1234567890"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors ${
                errors.phoneNumber
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as AdminRole })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 text-sm transition-colors"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Ops">Ops</option>
              <option value="Finance">Finance</option>
              <option value="Logistics">Logistics</option>
              <option value="Support">Support</option>
              <option value="Read-Only">Read-Only</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
