// src/components/TrainerSidebar.js
import { NavLink, useNavigate } from "react-router-dom";

const TrainerSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-orange-500 text-white"
         : "text-gray-700 hover:bg-orange-50"
     }`;

  return (
    <aside className="w-64 min-h-screen p-6 flex flex-col bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="mb-10">
        <h2 className="text-2xl font-extrabold text-orange-500">
          SkillQuest
        </h2>
        <p className="text-xs text-gray-500">Trainer Portal</p>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/trainer" className={linkClass}>
          📘 My Modules
        </NavLink>
      </nav>

      {/* Hint */}
      <div className="mt-6 text-xs text-gray-400 leading-relaxed">
        Select a module to manage topics, levels, and tasks.
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-auto px-4 py-3 rounded-lg text-sm font-medium
                   text-red-600 hover:bg-red-50 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default TrainerSidebar;
