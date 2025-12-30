"use client";

import { useState } from "react";

export default function SettingsForm() {
  const [siteName, setSiteName] = useState("My Awesome Admin");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [theme, setTheme] = useState("Light");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert(
      `Settings saved!\nSite: ${siteName}\nEmail: ${adminEmail}\nTheme: ${theme}\nNotifications: ${
        notifications ? "Enabled" : "Disabled"
      }`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-700">User Settings</h2>

      <div className="space-y-4">
        {/* Site Name */}
        <div>
          <label className="block mb-1 font-medium">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Admin Email */}
        <div>
          <label className="block mb-1 font-medium">Admin Email</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block mb-1 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="font-medium">Enable Notifications</label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
