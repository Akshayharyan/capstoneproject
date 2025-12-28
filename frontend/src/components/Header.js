import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const path = location.pathname.toLowerCase();

  // 🔥 Hide header for admin & trainer
  if (path.startsWith("/admin") || path.startsWith("/trainer")) {
    return null;
  }

  return (
    <nav className="
      sticky top-0 z-50
      flex items-center justify-between
      px-6 py-4
      bg-[#1E293B]/80
      backdrop-blur-md
      shadow-lg
      border-b border-white/10
    ">
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
      >
        SkillQuest
      </Link>

      {/* CENTER NAV */}
      <div className="flex gap-8 text-sm font-medium">
        {!isAuthenticated && (
          <>
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/about" className="hover:text-blue-300">About</Link>
            <Link to="/features" className="hover:text-blue-300">Features</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <Link to="/modules" className="hover:text-blue-300">Modules</Link>
            <Link to="/leaderboard" className="hover:text-blue-300">Leaderboard</Link>
            <Link to="/achievements" className="hover:text-blue-300">Achievements</Link>
            <Link to="/profile" className="hover:text-blue-300">Profile</Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 border border-blue-500 text-blue-300 rounded-md hover:bg-blue-600 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 bg-blue-500 rounded-md hover:bg-blue-600 text-white"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-blue-300 text-sm">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-500 rounded-md hover:bg-red-600 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
