import React, { useState, useEffect } from "react";

const TABS = ["Overview", "Achievements", "Settings"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser] = useState(null);

  // New states
  const [role, setRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUser(data);
        setRole(data.role || "Employee");
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return <p className="text-center mt-32 text-white text-xl">Loading profile…</p>;

  // Same avatar as dashboard
  const avatarSeed = user?.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

 const saveAccount = async () => {
  setSaving(true);
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/account", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role, password: newPassword }),
  });

  const data = await res.json();
  setSaving(false);

  if (!res.ok) {
    alert(data.message || "Update failed");
    return;
  }

  // 🚀 Step-2: Save new token from backend if available
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  // 🔄 Refresh user profile immediately
  const refresh = await fetch("http://localhost:5000/api/user/me", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const updatedUser = await refresh.json();
  setUser(updatedUser);

  setNewPassword("");
  alert("Account updated successfully");
};

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl p-8 text-center shadow-lg">
        <img
          src={avatarUrl}
          alt="profile"
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-600 shadow-md"
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
        <p className="text-gray-300 mt-2 text-sm">{role}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 space-x-8 border-b border-gray-700 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-blue-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-10">
        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
            <div className="bg-[#1e293b] rounded-xl p-6 space-y-4 shadow-md mb-8">
              <p><span className="font-semibold">XP:</span> {user.xp}</p>
              <p><span className="font-semibold">Level:</span> {user.level}</p>
              <p><span className="font-semibold">Badges:</span> {user.badges.length}</p>
            </div>
          </>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === "Achievements" && (
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            {user.badges.length === 0 ? (
              <p className="text-gray-400">🏆 No badges yet</p>
            ) : (
              <ul className="space-y-2">
                {user.badges.map((b, i) => (
                  <li key={i} className="bg-blue-700/40 p-3 rounded-lg">🏅 {b}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* SETTINGS — ROLE + PASSWORD */}
        {activeTab === "Settings" && (
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-md space-y-6">
            <h3 className="text-lg font-semibold mb-2">Account Settings</h3>

            {/* Role */}
            <div>
              <label className="font-semibold">Job Role / Title:</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full p-2 rounded bg-[#334155]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-semibold">Change Password:</label>
              <input
                type="password"
                value={newPassword}
                placeholder="New password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full p-2 rounded bg-[#334155]"
              />
            </div>

            <button
              disabled={saving}
              onClick={saveAccount}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
