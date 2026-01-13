import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ActivityFeed from "../components/ActivityFeed";

import {
  Sparkles,
  Flame,
  Trophy,
  Zap,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("DASHBOARD API DATA:", data);

      if (!res.ok) throw new Error(data.message);

      setProfile(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= LOADING ================= */
  if (loading || !profile) {
    return (
      <div className="text-center mt-24 text-black text-lg animate-pulse">
        Loading Dashboard…
      </div>
    );
  }

  const { user, stats = {}, recentActivity = [], modules = [], badges: topBadges = [] } = profile;

  /* ================= STATS FIX (FUNCTIONAL) ================= */

  // ✅ XP (works already)
  const totalXP =
    stats.totalPoints ??
    stats.totalXP ??
    user?.xp ??
    0;

  // ✅ Badges earned (works even if backend sends badges array)
  const badgesEarned =
    stats.badgesEarned ??
    stats.totalBadges ??
    (Array.isArray(user?.badges) ? user.badges.length : null) ??
    (Array.isArray(topBadges) ? topBadges.length : null) ??
    0;

  // ✅ Streak (works with multiple backend formats)
  const streakFromBackend =
    stats.learningStreak ??
    stats.streak ??
    user?.streak ??
    null;

  // 🔥 If backend doesn't send streak, calculate from recentActivity dates
  const calculateStreakFromActivity = (activityList) => {
    if (!Array.isArray(activityList) || activityList.length === 0) return 0;

    // Extract dates safely
    const dates = activityList
      .map((a) => a.date || a.createdAt || a.updatedAt)
      .filter(Boolean)
      .map((d) => new Date(d))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => b - a); // latest first

    if (dates.length === 0) return 0;

    // Normalize date to yyyy-mm-dd
    const normalize = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const uniqueDays = [...new Set(dates.map(normalize))];

    // streak counting
    let streakCount = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);

      const diffDays = Math.round((prev - curr) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) streakCount++;
      else break;
    }

    return streakCount;
  };

  const learningStreak =
    typeof streakFromBackend === "number"
      ? streakFromBackend
      : calculateStreakFromActivity(recentActivity);

  /* ================= MODULE PROGRESS FIX ================= */
  const getModuleProgress = (m) => {
    // completed => 100%
    if (m?.completed === true) return 100;

    // numeric progress
    if (typeof m?.progress === "number") return Math.min(Math.max(m.progress, 0), 100);

    // string progress like "60"
    if (typeof m?.progress === "string" && !isNaN(Number(m.progress)))
      return Math.min(Math.max(Number(m.progress), 0), 100);

    // progressPercent
    if (typeof m?.progressPercent === "number")
      return Math.min(Math.max(m.progressPercent, 0), 100);

    // nested progressPercent
    if (typeof m?.moduleProgress?.progressPercent === "number")
      return Math.min(Math.max(m.moduleProgress.progressPercent, 0), 100);

    // completedTopics / totalTopics
    if (
      typeof m?.completedTopics === "number" &&
      typeof m?.totalTopics === "number" &&
      m.totalTopics > 0
    ) {
      return Math.round((m.completedTopics / m.totalTopics) * 100);
    }

    // calculate from topics
    if (Array.isArray(m?.topics) && m.topics.length > 0) {
      const completed = m.topics.filter((t) => t.completed === true).length;
      return Math.round((completed / m.topics.length) * 100);
    }

    return 0;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 ml-72 px-10 py-10">
        {/* HERO */}
        <div className="mb-10">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Your Learning Dashboard
              </div>

              <h1 className="text-4xl font-extrabold text-black leading-tight">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {user?.name}
                </span>{" "}
                👋
              </h1>

              <p className="text-slate-600 mt-2 max-w-xl">
                Keep going! Complete lessons, solve challenges, earn XP and level
                up 🚀
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/modules")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
              >
                Explore Modules <ArrowRight className="inline w-5 h-5 ml-1" />
              </button>

              <button
                onClick={() => navigate("/leaderboard")}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-black font-bold hover:bg-slate-50 transition"
              >
                Leaderboard 🏆
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Total XP"
            value={totalXP}
            gradient="from-teal-500 to-emerald-500"
          />

          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Badges Earned"
            value={badgesEarned}
            gradient="from-yellow-500 to-orange-500"
          />

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Learning Streak</p>
                <p className="text-2xl font-extrabold text-black">
                  {learningStreak} Days
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i < learningStreak ? "bg-orange-500" : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTINUE LEARNING */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-black">
              Continue Learning
            </h2>

            <button
              onClick={() => navigate("/modules")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View all modules →
            </button>
          </div>

          {modules.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 text-center">
              <p className="text-black font-semibold">
                You haven’t started learning yet.
              </p>
              <p className="text-slate-600 mt-1">
                Start a module and begin earning XP 🎯
              </p>

              <button
                onClick={() => navigate("/modules")}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow hover:shadow-lg transition"
              >
                Start Learning
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m, index) => {
              const moduleId = m.id || m._id;
              const progress = getModuleProgress(m);
              const completed = progress >= 100 || m.completed === true;

              return (
                <div
                  key={moduleId || index}
                  onClick={() => navigate(`/modules/${moduleId}/topics`)}
                  className="group rounded-3xl border border-slate-200 bg-white shadow-sm p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-black">
                        {m.title || "Untitled Module"}
                      </h3>

                      <p className="text-sm text-slate-600 mt-1">
                        {completed
                          ? "All topics completed 🎉"
                          : "Resume where you left off"}
                      </p>
                    </div>

                    {completed ? (
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-slate-700 font-semibold mb-2">
                      <span>Progress</span>
                      <span className="text-black">{progress}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                      <PlayCircle className="w-5 h-5" />
                      {completed ? "Review Module" : "Continue Learning"}
                    </span>

                    <span className="text-slate-400 group-hover:text-indigo-600 transition">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ACTIVITY */}
        <div>
          <ActivityFeed recentActivity={recentActivity} />
        </div>
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${gradient} shadow-md`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-600 font-medium">{label}</p>
          <p className="text-2xl font-extrabold text-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
