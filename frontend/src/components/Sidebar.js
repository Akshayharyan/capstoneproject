import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  User,
  LogOut,
  Zap,
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const avatarSeed = user?.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

  const xp = user?.xp || 0;
  const level = user?.level || 1;

  // XP required for next level (KEEPING YOUR LOGIC)
  const nextLevelXP = level * (level + 1) * 50;
  const progressPercent = Math.min((xp / nextLevelXP) * 100, 100);

  // Proper circular ring (KEEPING YOUR LOGIC)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Modules",
      path: "/modules",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50">
      {/* TOP BRAND */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
            <Zap className="w-5 h-5 text-white" />
          </div>

          <div className="leading-tight">
            <p className="text-lg font-extrabold text-black">SkillQuest</p>
            <p className="text-xs text-slate-500 -mt-0.5">
              Learn • Play • Level Up
            </p>
          </div>
        </Link>
      </div>

      {/* USER PROFILE CARD */}
      <div className="px-6 py-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-indigo-50 border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Circle Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>

              <img
                src={avatarUrl}
                alt="avatar"
                className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200"
              />

              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-xs font-extrabold shadow">
                LVL {level}
              </span>
            </div>

            {/* Name + XP */}
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-black leading-tight truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-600 truncate">
                {user?.email || "user@email.com"}
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                  <span>XP Progress</span>
                  <span className="text-black">
                    {xp} / {nextLevelXP}
                  </span>
                </div>

                <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Complete tasks to level up faster ⚡
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="px-4 flex flex-col gap-2">
        {navLinks.map((link) => {
          const active = isActive(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200
                ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-black hover:bg-slate-100"
                }
              `}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-white/90" />
              )}

              <span className={`${active ? "text-white" : "text-slate-600"}`}>
                {link.icon}
              </span>

              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-6 left-0 w-full px-4">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-slate-900 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        <p className="mt-3 text-center text-[11px] text-slate-500">
          SkillQuest © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
