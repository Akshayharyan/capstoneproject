import React, { useState, useEffect } from "react";

const TABS = ["Overview", "Achievements", "Settings"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user)
    return <p className="text-center mt-32 text-white text-xl">Loading profile…</p>;

  // SAME PFP AS DASHBOARD
  const avatarSeed = user?.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* HEADER */}
      <div className="bg-[#1e293b] rounded-xl p-8 text-center shadow-lg">
        <img
          src={avatarUrl}
          alt="profile"
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-600 shadow-md"
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
      </div>

      {/* TABS */}
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

      {/* TAB CONTENT */}
      <div className="mt-10">
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>

            <div className="bg-[#1e293b] rounded-xl p-6 space-y-4 shadow-md">
              <p>
                <span className="font-semibold">XP:</span> {user.xp}
              </p>
              <p>
                <span className="font-semibold">Level:</span> {user.level}
              </p>
              <p>
                <span className="font-semibold">Badges:</span>{" "}
                {user.badges.length}
              </p>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="bg-[#1e293b] rounded-xl p-6 space-y-4 mt-8 shadow-md">
              <p className="font-semibold">Progress to next level</p>
              <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${Math.min(
                      (user.xp / ((user.level + 1) * (user.level + 2) * 25)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === "Achievements" && (
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            {user.badges.length === 0 ? (
              <p className="text-gray-400">🏆 No badges yet — keep learning!</p>
            ) : (
              <ul className="space-y-2">
                {user.badges.map((b, index) => (
                  <li key={index} className="bg-blue-700/40 p-3 rounded-lg">
                    🏅 {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "Settings" && (
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <p className="text-gray-400">
              ⚙️ More customization features coming soon…
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
