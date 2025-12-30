import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Menu, X } from "lucide-react";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const path = location.pathname.toLowerCase();

  // 🔥 HIDE HEADER FOR ADMIN & TRAINER
  if (path.startsWith("/admin") || path.startsWith("/trainer")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-105 transition">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SkillQuest
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {!isAuthenticated && (
            <>
              <Link to="/" className="hover:text-indigo-600">Home</Link>
              <Link to="/about" className="hover:text-indigo-600">About</Link>
              <Link to="/features" className="hover:text-indigo-600">Features</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
              <Link to="/modules" className="hover:text-indigo-600">Modules</Link>
              <Link to="/leaderboard" className="hover:text-indigo-600">Leaderboard</Link>
              <Link to="/achievements" className="hover:text-indigo-600">Achievements</Link>
              <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
            </>
          )}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600">
                Hi, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-slate-200 bg-white">
          <nav className="flex flex-col gap-4 mt-4 text-sm">
            {!isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
                <Link to="/features" onClick={() => setMobileOpen(false)}>Features</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/modules" onClick={() => setMobileOpen(false)}>Modules</Link>
                <Link to="/leaderboard" onClick={() => setMobileOpen(false)}>Leaderboard</Link>
                <Link to="/achievements" onClick={() => setMobileOpen(false)}>Achievements</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
