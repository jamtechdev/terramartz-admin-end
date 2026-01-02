"use client";

import DashboardCard from "../../common/DashboardCard";
import DashboardHeader from "../../dashboard/DashboardHeader";

type User = {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

type UserFormProps = {
  user: User;
  onChange: (user: User) => void;
  onSave: () => void;
  title?: string;
};

export default function UserForm({
  user,
  onChange,
  onSave,
  title,
}: UserFormProps) {
  return (
    <div className="max-w-xl mx-auto">
      <DashboardCard>
        <DashboardHeader title={title || "User Form"} />
        <div className="space-y-4">
          <div>
            <label className="text-black block text-lg">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => onChange({ ...user, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="text-black block text-lg">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => onChange({ ...user, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="text-black block text-lg">Role</label>
            <select
              value={user.role}
              onChange={(e) => onChange({ ...user, role: e.target.value })}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>User</option>
              <option>Admin</option>
              <option>Manager</option>
            </select>
          </div>
          <div>
            <label className="text-black block text-lg">Status</label>
            <select
              value={user.status}
              onChange={(e) =>
                onChange({
                  ...user,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <button
            onClick={onSave}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
          >
            Save
          </button>
        </div>
      </DashboardCard>
    </div>
  );
}
