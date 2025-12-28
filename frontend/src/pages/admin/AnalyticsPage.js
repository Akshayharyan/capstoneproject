import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#7c3aed", "#22c55e", "#3b82f6", "#ef4444"];

function AnalyticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <p className="text-lg">Loading analytics…</p>;
  }

  const roleData = [
    { name: "Admins", value: stats.totalAdmins },
    { name: "Trainers", value: stats.totalTrainers },
    { name: "Employees", value: stats.totalEmployees },
  ];

  const moduleData = [
    { name: "Modules", value: stats.totalModules },
    { name: "Assignments", value: stats.totalAssignments },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-700 mb-8">
        📊 Platform Analytics
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Trainers" value={stats.totalTrainers} />
        <StatCard title="Employees" value={stats.totalEmployees} />
        <StatCard title="Modules" value={stats.totalModules} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-8">
        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            Modules vs Assignments
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={moduleData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            User Role Distribution
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {roleData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white border border-purple-200 p-6 rounded-xl shadow text-center">
    <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
    <p className="text-3xl font-bold text-purple-700 mt-2">{value}</p>
  </div>
);

export default AnalyticsPage;
