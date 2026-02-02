// src/components/TrainerSidebar.js
import { NavLink, useNavigate } from "react-router-dom";

const TrainerSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
     ${
       isActive
         ? "bg-orange-500 text-white shadow"
         : "text-gray-700 hover:bg-orange-50"
     }`;

  return (
    <aside className="w-72 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b">
        <h2 className="text-2xl font-extrabold text-orange-500">
          SkillQuest
        </h2>
        <p className="text-xs text-gray-500 mt-1">Trainer Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-4 py-6">
        <NavLink to="/trainer" className={linkClass}>
          📘 My Modules
        </NavLink>
      </nav>

      {/* Hint */}
      <div className="px-6 text-xs text-gray-400 leading-relaxed">
        Select a module to manage topics, tasks, and achievements.
      </div>

      {/* Logout (FIXED) */}
      <div className="mt-auto px-6 py-4 border-t bg-white">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2
                     px-4 py-3 rounded-xl text-sm font-semibold
                     text-red-600 hover:bg-red-50 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default TrainerSidebar;
