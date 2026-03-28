import React from "react";
import { motion } from "framer-motion";

function ActivityFeed({ recentActivity = [] }) {
  const iconMap = {
    check: "✅",
    trophy: "🏆",
    medal: "🎖️",
    rocket: "🚀",
    play: "▶️",
    module: "📚",
    level: "⬆️",
    xp: "⚡",
    badge: "🎖️",
    streak: "🔥",
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const time = d.toLocaleTimeString();
    return `${month}/${day}/${year} ${time}`;
  };

  return (
    <div className="mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg p-8"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Activity</h2>

        {recentActivity.length === 0 && (
          <p className="text-slate-400 text-center py-8">No recent activity yet. Keep learning! 🎯</p>
        )}

        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 transition-all duration-300 border border-transparent hover:border-slate-200"
            >
              <div className="text-3xl flex-shrink-0">
                {iconMap[activity.icon] || "📌"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-slate-700 font-medium text-sm">
                  {activity.message || "Activity completed"}
                </p>
              </div>

              <div className="text-xs text-slate-500 font-medium flex-shrink-0 whitespace-nowrap">
                {formatDate(activity.createdAt)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ActivityFeed;
