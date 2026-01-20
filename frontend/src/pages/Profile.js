import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user: authUser } = useAuth(); // ✅ for XP access if needed
  const [user, setUser] = useState(null);

  const [completedModulesCount, setCompletedModulesCount] = useState(0);
  const [loadingModules, setLoadingModules] = useState(true);

  /* ================= FETCH USER ================= */
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

  /* ================= FRONTEND-ONLY MODULE COMPLETION ================= */
  useEffect(() => {
    const fetchCompletedModules = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const completed = (data.modules || []).filter(
          (mod) =>
            Array.isArray(mod.topics) &&
            mod.topics.length > 0 &&
            mod.topics.every((t) => t.status === "completed")
        ).length;

        setCompletedModulesCount(completed);
      } catch (err) {
        console.error("Failed to compute completed modules", err);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchCompletedModules();
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

  /* ================= ACHIEVEMENTS (SAME AS ACHIEVEMENTS PAGE) ================= */
  const totalXP = Number(user?.xp || authUser?.xp || 0);

  const achievements = [
    // XP
    {
      id: "xp_50",
      title: "XP Beginner",
      description: "Earn 50 XP",
      category: "XP",
      icon: "⚡",
      target: 50,
      progress: totalXP,
      unlocked: totalXP >= 50,
    },
    {
      id: "xp_100",
      title: "XP Explorer",
      description: "Earn 100 XP",
      category: "XP",
      icon: "🔥",
      target: 100,
      progress: totalXP,
      unlocked: totalXP >= 100,
    },
    {
      id: "xp_200",
      title: "XP Grinder",
      description: "Earn 200 XP",
      category: "XP",
      icon: "💎",
      target: 200,
      progress: totalXP,
      unlocked: totalXP >= 200,
    },

    // MODULES
    {
      id: "module_1",
      title: "First Module Complete",
      description: "Complete your first module",
      category: "Modules",
      icon: "🏁",
      target: 1,
      progress: completedModulesCount,
      unlocked: completedModulesCount >= 1,
    },
    {
      id: "module_2",
      title: "Module Master",
      description: "Complete 2 modules",
      category: "Modules",
      icon: "👑",
      target: 2,
      progress: completedModulesCount,
      unlocked: completedModulesCount >= 2,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
                {unlockedCount}/{achievements.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  loadingModules={loadingModules}
                />
              ))}
            </div>
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

/* ================= ACHIEVEMENT CARD (SAME STYLE) ================= */
const AchievementCard = ({ achievement, loadingModules }) => {
  const progressPercent = Math.min(
    Math.round((achievement.progress / achievement.target) * 100),
    100
  );

  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300
        ${
          achievement.unlocked
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl ring-4 ring-indigo-300 ring-offset-2 hover:scale-[1.03]"
            : "bg-white/70 backdrop-blur border text-gray-600"
        }`}
    >
      {!achievement.unlocked && !loadingModules && (
        <div className="absolute inset-0 rounded-3xl bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
          <span className="text-5xl opacity-70">🔒</span>
        </div>
      )}

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4
          ${achievement.unlocked ? "bg-white/20" : "bg-gray-200"}`}
      >
        {achievement.icon}
      </div>

      <h3 className="font-bold text-lg">{achievement.title}</h3>
      <p className="text-sm mt-1 opacity-90">{achievement.description}</p>

      <div className="mt-5">
        {achievement.unlocked ? (
          <span className="inline-block px-4 py-1 text-xs font-bold rounded-full bg-green-400 text-green-900">
            🎉 UNLOCKED
          </span>
        ) : (
          <>
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs mt-1">
              {achievement.progress} / {achievement.target}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
