import React from "react";

function ActivityFeed({ recentActivity = [] }) {
  const iconMap = {
    check: "✔️",
    trophy: "🏆",
    medal: "🎖️",
    rocket: "🚀",
    play: "▶️"
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>

      {recentActivity.length === 0 && (
        <p className="text-gray-400">No recent activity yet.</p>
      )}

      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity._id} className="flex items-start gap-3">
            <div className="bg-white/10 p-2 rounded-full text-xl">
              {iconMap[activity.icon] || "📌"}
            </div>

            <div>
              <p className="text-white">{activity.message}</p>
              <p className="text-sm text-gray-400">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
