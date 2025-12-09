import React from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import UsersPage from "./UsersPage";
import AssignModulePage from "./AssignModulePage";
import AnalyticsPage from "./AnalyticsPage";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0d0f1a] to-[#010203] text-white m-0 p-0">
      
      {/* Sidebar */}
<aside className="w-64 bg-[#11052a] border-r border-purple-700 p-6 flex flex-col gap-6 shadow-lg shadow-purple-900/30">
  <h2 className="text-2xl font-bold text-purple-300">Admin Panel</h2>

  <nav className="flex flex-col gap-3">
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg ${isActive ? "bg-purple-600" : "hover:bg-purple-800"}`
      }
    >
      Users
    </NavLink>

    <NavLink
      to="/admin/assign"
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg ${isActive ? "bg-purple-600" : "hover:bg-purple-800"}`
      }
    >
      Assign Trainee
    </NavLink>

    <NavLink
      to="/admin/analytics"
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg ${isActive ? "bg-purple-600" : "hover:bg-purple-800"}`
      }
    >
      Analytics
    </NavLink>
  </nav>

  <button onClick={handleLogout} className="mt-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500">
    Logout
  </button>
</aside>

      {/* Dynamic content */}
      <main className="flex-1 p-10">
        <Routes>
          <Route path="users" element={<UsersPage />} />
          <Route path="assign" element={<AssignModulePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
