import React from "react";
import Sidebar from "../components/Sidebar";
import ProgressCard from "../components/ProgressCard";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import ActivityFeed from "../components/ActivityFeed";

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome back, Sarah!
        </h1>

        <ProgressCard progress={75} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Points" value="1,250" />
          <StatCard label="Badges Earned" value="15" />
          <StatCard label="Modules Completed" value="8" />
        </div>

        <QuickActions />
        <ActivityFeed />
      </main>
    </div>
  );
}

export default Dashboard;
