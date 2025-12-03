// frontend/src/pages/dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ProgressCard from "../components/ProgressCard";
import StatCard from "../components/StatCard";
import ActivityFeed from "../components/ActivityFeed";

function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      } else {
        console.error("Dashboard fetch error:", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !profile)
    return (
      <div className="text-center mt-20 text-white text-xl">
        Loading Dashboard...
      </div>
    );

  const user = profile.user;
  const modules = profile.modules || []; // 🔥 Only STARTED modules from backend
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const nextLevelXP = profile.nextLevelXP || level * (level + 1) * 50;
  const skillCompletion = Math.min((xp / nextLevelXP) * 100, 100);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome back, {user?.name}!
        </h1>

        <ProgressCard progress={skillCompletion} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Points" value={xp} />
          <StatCard label="Badges Earned" value={profile?.stats?.badgesEarned ?? 0} />
          <StatCard
            label="Modules Completed"
            value={profile?.stats?.modulesCompleted ?? 0}
          />
        </div>

        {/* ⭐ STARTED MODULES ONLY */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Your Modules</h2>

          {modules.length === 0 && (
            <p className="text-gray-400">You haven't started any modules yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/modules/${m.id}/quests`)}
                className="relative p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-2">{m.title}</h3>
                <p className="opacity-90 mb-4">
                  {m.quests.filter((q) => q.done).length} / {m.quests.length} quests completed
                </p>

                {m.completed && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 📌 REAL DB Activity Feed */}
        <ActivityFeed recentActivity={profile.recentActivity} />
      </main>
    </div>
  );
}

export default Dashboard;
