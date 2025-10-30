// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#1E293B] text-white shadow-md">
      {/* Brand / Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors"
      >
        SkillQuest
      </Link>

      {/* Center Navigation */}
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-blue-400 transition-colors">
          Dashboard
        </Link>
        <Link to="/leaderboard" className="hover:text-blue-400 transition-colors">
          Leaderboard
        </Link>
        <Link to="/achievements" className="hover:text-blue-400 transition-colors">
          Achievements
        </Link>
      </div>

      {/* Right Side (Auth Links) */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-1.5 border border-blue-500 text-blue-500 rounded-md font-medium hover:bg-blue-500 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-500 rounded-md font-medium hover:bg-blue-600 transition text-white"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Header;
