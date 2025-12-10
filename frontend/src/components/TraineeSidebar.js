// src/components/TraineeSidebar.js
import { NavLink, useNavigate } from "react-router-dom";

const TraineeSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#11052a] border-r border-purple-700 p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-purple-300">Trainee Panel</h2>

      <NavLink
        to="/trainee"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg ${isActive ? "bg-purple-600" : "hover:bg-purple-800"}`
        }
      >
        My Modules
      </NavLink>

      <button
        className="mt-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
        onClick={logout}
      >
        Logout
      </button>
    </aside>
  );
};

export default TraineeSidebar;
