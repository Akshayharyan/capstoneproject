import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ActivityFeed from "../components/ActivityFeed";

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
      <div className="text-center mt-24 text-slate-600 text-lg animate-pulse">
        Loading Dashboard…
      </div>
    );
  }

  const { user, stats = {}, recentActivity = [], modules = [] } = profile;

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="flex-1 ml-64 px-10 py-10 animate-fade-in">

        {/* WELCOME */}
        <div className="mb-10 animate-slide-down">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-slate-600">
            Continue learning with short videos & challenges 🎥
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* TOTAL XP */}
          <StatCard
            icon="⚡"
            label="Total XP"
            value={stats.totalPoints || 0}
            color="teal"
          />

          {/* BADGES */}
          <StatCard
            icon="🏆"
            label="Badges Earned"
            value={stats.badgesEarned || 0}
            color="yellow"
          />

          {/* STREAK */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                🔥
              </div>
              <div>
                <p className="text-sm text-slate-600">Learning Streak</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.learningStreak || 0} Days
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i < (stats.learningStreak || 0)
                      ? "bg-orange-500"
                      : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= CONTINUE LEARNING ================= */}
        <section className="mb-12 animate-fade-in">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Continue Learning
          </h2>

          {modules.length === 0 && (
            <p className="text-slate-500">
              You haven’t started learning yet.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m, index) => (
              <div
                key={m.id}
                onClick={() => navigate(`/modules/${m.id}/topics`)}
                className="
                  bg-white rounded-2xl p-6 border shadow-sm cursor-pointer
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                  animate-slide-up
                "
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {m.title}
                  </h3>

                  {m.completed && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Completed
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500">
                  {m.completed
                    ? "All topics completed"
                    : "Resume from where you left off"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ACTIVITY ================= */}
        <div className="animate-fade-in">
          <ActivityFeed recentActivity={recentActivity} />
        </div>

      </main>
    </div>
  );
}

/* ================= SMALL STAT CARD ================= */
function StatCard({ icon, label, value, color }) {
  const colors = {
    teal: "bg-teal-100 text-teal-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
