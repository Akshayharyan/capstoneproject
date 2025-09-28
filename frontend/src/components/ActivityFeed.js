import React from "react";

function ActivityFeed() {
  const activities = [
    { icon: "✔", color: "text-green-400 bg-green-500/20", text: "Completed Module: Communication Skills", time: "2 days ago" },
    { icon: "🏅", color: "text-purple-400 bg-purple-500/20", text: "Earned Badge: Team Player", time: "5 days ago" },
    { icon: "▶", color: "text-blue-400 bg-blue-500/20", text: "Started Module: Project Management", time: "7 days ago" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`${activity.color} p-2 rounded-full`}>{activity.icon}</div>
            <p className="text-white">
              {activity.text}{" "}
              <span className="block text-sm text-gray-400">{activity.time}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
