import { AdminRole } from "@/app/types/admin-staff";
import { useState, useEffect } from "react";

export function CreateStaffModal({
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
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
  }>({});
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
    const newErrors: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
    } = {};

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
        newErrors.phoneNumber =
          "Phone number must be 10-15 digits, optionally with a + prefix";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Create New Staff
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Name <span className="text-red-500">*</span>
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
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-500"
              }`}
              placeholder="email@example.com"
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
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors pr-10 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-green-500"
                }`}
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
              Create Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
