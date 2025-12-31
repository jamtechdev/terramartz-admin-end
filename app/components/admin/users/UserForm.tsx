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
    <div className="max-w-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">{title || "User Form"}</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={user.name}
          onChange={(e) => onChange({ ...user, name: e.target.value })}
          className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
          placeholder="Name"
        />
        <input
          type="email"
          value={user.email}
          onChange={(e) => onChange({ ...user, email: e.target.value })}
          className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
          placeholder="Email"
        />
        <select
          value={user.role}
          onChange={(e) => onChange({ ...user, role: e.target.value })}
          className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
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
          className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
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
