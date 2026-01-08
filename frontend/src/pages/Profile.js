import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // 🔒 NORMALIZE BACKEND DATA
        setUser({
          ...data,
          xp: data.xp ?? 0,
          level: data.level ?? 1,
          badges: Array.isArray(data.badges) ? data.badges : [],
          moduleProgress: Array.isArray(data.moduleProgress)
            ? data.moduleProgress
            : [],
        });
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <p className="text-center mt-32 text-lg font-semibold text-slate-500">
        Loading profile…
      </p>
    );
  }

  /* ================= DERIVED STATS ================= */
  const avatarSeed = user.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

  const nextLevelXp = user.level * 100;
  const progressPercent = Math.min((user.xp / nextLevelXp) * 100, 100);

  const modulesCompleted = user.moduleProgress.filter(
    (m) => m.completedTopics?.length > 0
  ).length;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-sky-50 to-orange-50">
      <main className="flex-grow px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="profile"
                  className="w-28 h-28 rounded-full border-4 border-white shadow"
                />
                <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  Lv {user.level}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-slate-800">
                    {user.name}
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">
                    Learner
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-1">
                  Keep learning and leveling up 🚀
                </p>

                <div className="flex gap-6 mt-3 text-xs text-slate-500">
                  <span>{user.email}</span>
                </div>

                {/* XP BAR */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <button className="text-sm px-4 py-2 rounded-lg bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200">
                Edit Profile
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Stat label="Total XP" value={user.xp} />
            <Stat label="Modules Started" value={user.moduleProgress.length} />
            <Stat label="Modules Completed" value={modulesCompleted} />
          </div>

          {/* ACHIEVEMENTS / BADGES */}
          <div className="bg-white rounded-3xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Badges</h3>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                {user.badges.length}
              </span>
            </div>

            {user.badges.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No badges yet. Complete topics to earn some 🏆
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {user.badges.map((b, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border bg-slate-50 text-center text-sm font-semibold text-slate-700"
                  >
                    🏆 {b}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

/* ================= STAT CARD ================= */
const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-5 text-center shadow">
    <p className="text-2xl font-extrabold text-indigo-600">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

export default Profile;
