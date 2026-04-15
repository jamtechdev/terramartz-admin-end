"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../../dashboard/DashboardHeader";
import DashboardCard from "../../common/DashboardCard";
import { useAuth } from "@/app/context/AuthContext";
import { settingsService } from "@/app/services/settings.service";

export default function SettingsForm() {
  const { token } = useAuth();
  const [siteName, setSiteName] = useState("My Awesome Admin");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [theme, setTheme] = useState("Light");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [loyaltyPointValue, setLoyaltyPointValue] = useState("0.1");
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return;
      setLoadingSettings(true);
      const res = await settingsService.getAdminSettings(token);
      setLoadingSettings(false);

      if (res.success) {
        const value = Number(res.data?.loyaltyPointValue);
        if (Number.isFinite(value) && value > 0) {
          setLoyaltyPointValue(String(value));
        }
      } else {
        setStatusType("error");
        setStatusMessage(res.message || "Failed to load settings");
      }
    };

    loadSettings();
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setStatusMessage("");
    setStatusType("");

    const valueNum = Number(loyaltyPointValue);
    if (!Number.isFinite(valueNum) || valueNum <= 0) {
      setStatusType("error");
      setStatusMessage("Loyalty point value must be a positive number.");
      return;
    }

    setSaving(true);
    const res = await settingsService.updateAdminSettings(
      { loyaltyPointValue: valueNum },
      token,
    );
    setSaving(false);

    if (!res.success) {
      setStatusType("error");
      setStatusMessage(res.message || "Failed to save settings");
      return;
    }

    setStatusType("success");
    setStatusMessage("Settings saved successfully.");
  };

  return (
    <div className="max-w-xl mx-auto">
      <DashboardCard>
        <DashboardHeader title="Setting" />
        <div className="space-y-4">
          {/* <div>
            <label className="text-black block text-lg">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div> */}

          {/* Admin Email */}
          {/* <div>
            <label className="text-black block text-lg">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div> */}

          {/* Password */}
          {/* <div>
            <label className="text-black block text-lg">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div> */}

          {/* Theme */}
          {/* <div>
            <label className="text-black block text-lg">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/50 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
            >
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div> */}

          <div>
            <label className="text-black block text-lg">
              Loyalty Point Value (USD)
            </label>
            <input
              type="number"
              min="0.0001"
              step="0.0001"
              value={loyaltyPointValue}
              onChange={(e) => setLoyaltyPointValue(e.target.value)}
              className="w-full px-4 py-3 bg-white border-black/30 text-black/70 placeholder:text-black/50 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="0.1"
              disabled={loadingSettings || saving}
            />
            <p className="mt-1 text-xs text-gray-600">
              Example: 0.1 means 1 loyalty point = $0.10
            </p>
          </div>

          {/* Notifications */}
          {/* <div className="flex items-center space-x-2">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                type="checkbox"
                className="h-4 w-4 accent-green-600"
              />
              Enable Notifications
            </label>
          </div> */}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || loadingSettings}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-semibold"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {statusMessage && (
            <p
              className={`text-sm ${statusType === "error" ? "text-red-600" : "text-green-700"}`}
            >
              {statusMessage}
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
