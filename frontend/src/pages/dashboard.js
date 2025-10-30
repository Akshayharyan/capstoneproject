import React from "react";
import Sidebar from "../components/Sidebar";
import ProgressCard from "../components/ProgressCard";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import ActivityFeed from "../components/ActivityFeed";

// Sample data: Modules with nested Quests
const modules = [
  {
    id: 1,
    name: "HTML Basics",
    quests: ["Intro to HTML", "Forms & Inputs", "Links & Images"],
  },
  {
    id: 2,
    name: "CSS Styling",
    quests: ["Selectors & Properties", "Flexbox Layout", "Colors & Fonts"],
  },
  {
    id: 3,
    name: "JavaScript Essentials",
    quests: ["Variables & Loops", "Functions", "DOM Manipulation"],
  },
];

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

      {/* Modules Section */}
<section className="mb-8">
  <h2 className="text-2xl font-semibold mb-4">Your Modules</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {modules.map((module) => (
      <div
        key={module.id}
        className="relative p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer"
      >
        {/* Module Name */}
        <h3 className="text-2xl font-bold mb-2">{module.name}</h3>

        {/* Quests List */}
        <ul className="space-y-2">
          {module.quests.map((quest, index) => (
            <li
              key={index}
              className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
            >
              {/* Icon for quest */}
              <span className="flex-shrink-0 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold text-black">
                {index + 1}
              </span>
              {/* Quest Title */}
              <span>{quest}</span>
              {/* Optional completed checkmark */}
              {Math.random() > 0.5 && ( // replace with real completion logic
                <span className="ml-auto text-green-300 font-bold">✓</span>
              )}
            </li>
          ))}
        </ul>

        {/* XP Badge */}
        <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
          ★ {module.quests.length * 10} XP
        </span>
      </div>
    ))}
  </div>
</section>


        <ActivityFeed />
      </main>
    </div>
  );
}

export default Dashboard;
