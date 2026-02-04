import { useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  date: string;
};

export function EditUserModal({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>({
    firstName,
    lastName,
    phoneNumber: user.phoneNumber,
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string; phoneNumber?: string } = {};

    if (!formData.firstName || formData.firstName.trim().length === 0) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "First name must not exceed 50 characters";
    }

    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "Last name must not exceed 50 characters";
    }

    if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber =
          "Phone number must be 10-15 digits, optionally with a + prefix";
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
        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit User</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                if (errors.firstName) setErrors({ ...errors, firstName: undefined });
              }}
              maxLength={50}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors ${
                errors.firstName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                if (errors.lastName) setErrors({ ...errors, lastName: undefined });
              }}
              maxLength={50}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 text-sm transition-colors ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 text-sm cursor-not-allowed"
            />
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