import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
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
      if (!res.ok) throw new Error(data.message || "Failed to load dashboard");

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

  if (loading || !profile) {
    return (
      <div className="text-center mt-20 text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  const user = profile.user;
  const modules = Array.isArray(profile.modules) ? profile.modules : [];
  const stats = profile.stats || {};

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 p-8 ml-64 text-white">
        <h1 className="text-3xl font-bold mb-6">
          Welcome back, {user?.name} 👋
        </h1>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total XP" value={stats.totalPoints || 0} />
          <StatCard label="Badges Earned" value={stats.badgesEarned || 0} />
          <StatCard
            label="🔥 Learning Streak"
            value={`${stats.learningStreak || 0} Days`}
          />
        </div>

        {/* ⭐ STARTED MODULES */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Modules</h2>

          {modules.length === 0 && (
            <p className="text-gray-400">
              You haven't started any modules yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/modules/${m.id}/topics`)}
                className="relative p-6 rounded-xl shadow-lg cursor-pointer
                           transform hover:scale-105 transition
                           bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                <h3 className="text-2xl font-bold mb-2">{m.title}</h3>
                <p className="opacity-90">Continue learning</p>

                {m.completed && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Completed
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 📌 ACTIVITY */}
        <ActivityFeed recentActivity={profile.recentActivity || []} />
      </main>
    </div>
  );
}

export default Dashboard;
