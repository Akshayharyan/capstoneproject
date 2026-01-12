import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const AchievementPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");

  const [completedModulesCount, setCompletedModulesCount] = useState(0);
  const [loadingModules, setLoadingModules] = useState(true);

  /* ================= XP ================= */
  const totalXP = Number(user?.xp || 0);

  /* ================= FRONTEND-ONLY MODULE COMPLETION ================= */
  useEffect(() => {
    if (!user) return; // ✅ SAFE GUARD INSIDE EFFECT

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
  }, [user]);

  /* ================= SAFE GUARD (AFTER HOOKS) ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading achievements...</p>
      </div>
    );
  }

  /* ================= ACHIEVEMENTS ================= */
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

    // MODULES (FRONTEND-DERIVED)
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

  const filteredAchievements =
    activeTab === "All"
      ? achievements
      : achievements.filter((a) => a.category === activeTab);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionRate = Math.round(
    (unlockedCount / achievements.length) * 100
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-5xl">🏆</span> Your Achievements
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Level up your skills, earn XP, and unlock milestones as you progress.
          </p>
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <StatusCard
            icon="🎯"
            title="Unlocked"
            value={`${unlockedCount}/${achievements.length}`}
            gradient="from-indigo-500 to-purple-500"
          />
          <StatusCard
            icon="⚡"
            title="XP Earned"
            value={totalXP}
            gradient="from-green-400 to-emerald-500"
          />
          <StatusCard
            icon="📊"
            title="Completion"
            value={`${completionRate}%`}
            gradient="from-orange-400 to-pink-500"
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mt-8">
          {["All", "XP", "Modules"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition
                ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white border text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              loadingModules={loadingModules}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;

/* ================= COMPONENTS ================= */

const StatusCard = ({ icon, title, value, gradient }) => (
  <div
    className={`rounded-3xl p-6 text-white shadow-lg bg-gradient-to-br ${gradient}
      hover:scale-[1.02] transition-all`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-4xl font-extrabold mt-1">{value}</p>
      </div>
      <div className="text-4xl opacity-90">{icon}</div>
    </div>
  </div>
);

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
