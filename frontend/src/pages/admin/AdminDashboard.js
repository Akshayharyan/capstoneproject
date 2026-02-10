import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/create-module", label: "Create Module" },
    { to: "/admin/assign", label: "Assign Trainer" },
    { to: "/admin/employee-monitoring", label: "Employee Monitoring" }, // ✅ NEW
    { to: "/admin/analytics", label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-gray-900">

      {/* Sidebar */}
      <aside
        className="w-64 m-4 rounded-2xl bg-white/80 backdrop-blur-xl
                   border border-gray-200 shadow-xl
                   flex flex-col p-6"
      >
        {/* Brand */}
        <h2 className="text-2xl font-bold text-purple-700 mb-8">
          SkillQuest Admin
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl font-medium transition-all
                 ${
                   isActive
                     ? "bg-purple-600 text-white shadow-md"
                     : "text-gray-700 hover:bg-purple-100"
                 }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-2 rounded-xl
                     bg-red-500 hover:bg-red-600
                     text-white font-medium transition"
        >
          Logout
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
