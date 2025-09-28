import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-background-light dark:bg-background-dark p-5 border-r border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
        <h1 className="font-bold text-gray-900 dark:text-white">Sarah Miller</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="px-3 py-2 rounded-lg bg-primary text-white font-medium"
        >
          Dashboard
        </Link>
        <Link
          to="/modules"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10"
        >
          Modules
        </Link>
        <Link
          to="/leaderboard"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10"
        >
          Leaderboard
        </Link>
        <Link
          to="/profile"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
