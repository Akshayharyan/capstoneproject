// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-6 py-4
        bg-[#1E293B]/80
        backdrop-blur-md
        shadow-lg
        border-b border-white/10
      "
    >
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
      >
        SkillQuest
      </Link>

      {/* CENTER NAV */}
      <div className="flex gap-8 text-sm font-medium">

        {/* PUBLIC NAVIGATION */}
        {!isAuthenticated && (
          <>
            <Link to="/" className="hover:text-blue-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-300 transition">
              About
            </Link>
            <Link to="/features" className="hover:text-blue-300 transition">
              Features
            </Link>
          </>
        )}

        {/* LOGGED-IN NAVIGATION */}
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="hover:text-blue-300 transition">
              Dashboard
            </Link>
            <Link to="/Modules" className="hover:text-blue-300 transition">
              Modules
            </Link>
            <Link to="/leaderboard" className="hover:text-blue-300 transition">
              Leaderboard
            </Link>
            <Link to="/achievements" className="hover:text-blue-300 transition">
              Achievements
            </Link>
            <Link to="/profile" className="hover:text-blue-300 transition">
              Profile
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">

        {/* LOGGED-OUT BUTTONS */}
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 border border-blue-500 text-blue-300 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-3 py-1.5 bg-blue-500 rounded-md hover:bg-blue-600 transition text-white"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* LOGGED-IN BUTTONS */}
        {isAuthenticated && (           
          <>
            <span className="text-blue-300 text-sm">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-500 rounded-md hover:bg-red-600 transition text-white"
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
