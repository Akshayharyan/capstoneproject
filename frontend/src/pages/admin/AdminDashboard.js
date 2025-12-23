import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-200 to-purple-200 border-r border-purple-300 p-6 flex flex-col gap-6 shadow-lg">
        <h2 className="text-2xl font-bold text-purple-700">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          {[
            { to: "/admin/users", label: "Users" },
            { to: "/admin/create-module", label: "Create Module" },
            { to: "/admin/assign", label: "Assign Trainer" },
            { to: "/admin/analytics", label: "Analytics" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-purple-800 hover:bg-purple-300/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
