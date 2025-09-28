import React from "react";

function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <button className="flex-1 py-3 border border-gray-600 text-purple-400 rounded-lg hover:bg-primary/20">
          Start New Module
        </button>
        <button className="flex-1 py-3 border border-gray-600 text-purple-400 rounded-lg hover:bg-primary/20">
          View Leaderboard
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
