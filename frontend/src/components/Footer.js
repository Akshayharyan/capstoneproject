import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#fffaf5] border-t border-slate-200 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT: BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold">
            ⚡
          </div>
          <span className="text-xl font-semibold text-slate-800">
            SkillQuest
          </span>
        </div>

        {/* CENTER: LINKS */}
        <div className="flex gap-6 text-sm text-slate-500">
          <Link to="/about" className="hover:text-teal-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-teal-600 transition">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-teal-600 transition">
            Privacy Policy
          </Link>
        </div>

        {/* RIGHT: COPYRIGHT */}
        <p className="text-sm text-slate-400 text-center md:text-right">
          © {new Date().getFullYear()} SkillQuest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
