import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Menu, X, LogOut, User } from "lucide-react";

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const path = location.pathname.toLowerCase();

  // 🔥 HIDE HEADER FOR ADMIN & TRAINER (KEEPING YOUR LOGIC)
  if (path.startsWith("/admin") || path.startsWith("/trainer")) {
    return null;
  }

  // Helper for active links
  const isActive = (route) => path === route;

  // Reusable classes (Light theme + black text)
  const navLinkBase =
    "px-3 py-2 rounded-lg transition font-medium text-sm text-black hover:bg-slate-100 hover:text-black";

  const navLinkActive =
    "px-3 py-2 rounded-lg transition font-semibold text-sm text-black bg-slate-100";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-105 transition">
            <Zap className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-black">
              SkillQuest
            </span>
            <span className="text-[11px] text-slate-500 -mt-1">
              Learn • Level Up • Win
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                className={isActive("/") ? navLinkActive : navLinkBase}
              >
                Home
              </Link>

              <Link
                to="/about"
                className={isActive("/about") ? navLinkActive : navLinkBase}
              >
                About
              </Link>

              <Link
                to="/features"
                className={
                  isActive("/features") ? navLinkActive : navLinkBase
                }
              >
                Features
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard") ? navLinkActive : navLinkBase
                }
              >
                Dashboard
              </Link>

              <Link
                to="/modules"
                className={isActive("/modules") ? navLinkActive : navLinkBase}
              >
                Modules
              </Link>

              <Link
                to="/leaderboard"
                className={
                  isActive("/leaderboard") ? navLinkActive : navLinkBase
                }
              >
                Leaderboard
              </Link>

              <Link
                to="/achievements"
                className={
                  isActive("/achievements") ? navLinkActive : navLinkBase
                }
              >
                Achievements
              </Link>

              <Link
                to="/profile"
                className={isActive("/profile") ? navLinkActive : navLinkBase}
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-slate-300 text-black font-semibold hover:bg-slate-100 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition shadow-sm"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* User Badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-black">
                    {user?.name || "User"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Welcome back 👋
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="text-black" /> : <Menu className="text-black" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 border-t border-slate-200 bg-white">
          <nav className="flex flex-col gap-2 mt-4 text-sm">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/") ? navLinkActive : navLinkBase}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/about") ? navLinkActive : navLinkBase}
                >
                  About
                </Link>

                <Link
                  to="/features"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/features") ? navLinkActive : navLinkBase}
                >
                  Features
                </Link>

                <div className="h-[1px] bg-slate-200 my-2" />

                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-black font-semibold hover:bg-slate-100 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/dashboard") ? navLinkActive : navLinkBase}
                >
                  Dashboard
                </Link>

                <Link
                  to="/modules"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/modules") ? navLinkActive : navLinkBase}
                >
                  Modules
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/leaderboard") ? navLinkActive : navLinkBase}
                >
                  Leaderboard
                </Link>

                <Link
                  to="/achievements"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/achievements") ? navLinkActive : navLinkBase}
                >
                  Achievements
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/profile") ? navLinkActive : navLinkBase}
                >
                  Profile
                </Link>

                <div className="h-[1px] bg-slate-200 my-2" />

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
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
