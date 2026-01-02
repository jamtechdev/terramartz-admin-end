"use client";

import { useState } from "react";
import DashboardHeader from "../../dashboard/DashboardHeader";
import DashboardCard from "../../common/DashboardCard";

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
    <div className="max-w-xl mx-auto">
      <DashboardCard>
        <DashboardHeader title="Setting" />
        <div className="space-y-4">
          <div>
            <label className="text-black block text-lg">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Admin Email */}
          <div>
            <label className="text-black block text-lg">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-black block text-lg">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="text-black block text-lg">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                type="checkbox"
                className="h-4 w-4 accent-green-600"
              />
              Enable Notifications
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
          >
            Save Settings
          </button>
        </div>
      </DashboardCard>
    </div>
  );
}
