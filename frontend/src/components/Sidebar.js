import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  // SAFE, non-human avatar generator
  const avatarSeed = user?.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

  // XP & Level from user
  const xp = user?.xp || 0;
  const level = user?.level || 1;

  // XP required for next level (Progressive)
  const nextLevelXP = level * (level + 1) * 50;

  // Progress percentage for XP Ring
  const progressPercent = Math.min((xp / nextLevelXP) * 100, 100);

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-background-light dark:bg-background-dark p-5 border-r border-gray-300 dark:border-gray-700 z-50">

      {/* USER PROFILE */}
      <div className="flex flex-col items-center mb-8">

        {/* XP Circle */}
        <div className="relative w-20 h-20 flex items-center justify-center group">

          {/* Base Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-300/40"></div>

          {/* XP Progress Ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-500"
            style={{
              clipPath: `inset(${100 - progressPercent}% 0 0 0)`
            }}
          ></div>

          {/* Avatar */}
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-14 h-14 rounded-full bg-white shadow-md z-10 group-hover:scale-110 transition-transform"
          />

          {/* LEVEL BADGE */}
          <span className="absolute -bottom-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            LVL {level}
          </span>
        </div>

        {/* Name */}
        <h1 className="mt-4 font-bold text-gray-900 dark:text-white text-center">
          {user?.name || "User"}
        </h1>

        {/* Email */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {user?.email}
        </p>

        {/* XP Text */}
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          XP: <span className="font-bold">{xp}</span> / {nextLevelXP}
        </p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col gap-2">

        <Link
          to="/dashboard"
          className="px-3 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/Modules"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10 transition"
        >
          Modules
        </Link>

        <Link
          to="/leaderboard"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10 transition"
        >
          Leaderboard
        </Link>

        <Link
          to="/profile"
          className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-400 hover:bg-primary/10 transition"
        >
          Profile
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
