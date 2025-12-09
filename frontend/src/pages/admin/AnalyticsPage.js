import React from "react";

function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-300 mb-8">📊 Platform Analytics</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-purple-900/40 border border-purple-500 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-4xl font-extrabold mt-3">--</p>
        </div>

        <div className="bg-purple-900/40 border border-purple-500 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold">Modules Assigned</h2>
          <p className="text-4xl font-extrabold mt-3">--</p>
        </div>

        <div className="bg-purple-900/40 border border-purple-500 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <p className="text-2xl font-extrabold mt-3">Coming Soon ⚡</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
