"use client";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

type UserFormProps = {
  user: User;
  onChange: (user: User) => void;
  onSave: () => void;
  title: string;
};

export default function UserForm({
  user,
  onChange,
  onSave,
  title,
}: UserFormProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <label className="block mb-2">
        Name:
        <input
          type="text"
          value={user.name}
          onChange={(e) => onChange({ ...user, name: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-2">
        Email:
        <input
          type="email"
          value={user.email}
          onChange={(e) => onChange({ ...user, email: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-2">
        Role:
        <select
          value={user.role}
          onChange={(e) => onChange({ ...user, role: e.target.value })}
          className="w-full border p-2 rounded mt-1"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </label>

      <label className="block mb-4">
        Status:
        <select
          value={user.status}
          onChange={(e) =>
            onChange({
              ...user,
              status: e.target.value as "Active" | "Inactive",
            })
          }
          className="w-full border p-2 rounded mt-1"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>

      <button
        onClick={onSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
