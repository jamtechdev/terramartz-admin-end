"use client";

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

export default function UserForm({ user, onChange, onSave, title }: UserFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">{title || "User Form"}</h2>

      <div className="space-y-4">
        <input
          type="text"
          value={user.name}
          onChange={(e) => onChange({ ...user, name: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          placeholder="Name"
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => onChange({ ...user, email: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          placeholder="Email"
        />
        <select
          value={user.role}
          onChange={(e) => onChange({ ...user, role: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        >
          <option>User</option>
          <option>Admin</option>
          <option>Manager</option>
        </select>
        <select
          value={user.status}
          onChange={(e) =>
            onChange({ ...user, status: e.target.value as "Active" | "Inactive" })
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          onClick={onSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Save
        </button>
      </div>
    </div>
  );
}
