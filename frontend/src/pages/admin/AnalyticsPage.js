import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <p className="text-lg">Loading analytics...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-700 mb-8">
        📊 Platform Analytics
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Trainers" value={stats.totalTrainers} />
        <StatCard title="Employees" value={stats.totalEmployees} />
        <StatCard title="Modules" value={stats.totalModules} />
        <StatCard title="Assignments" value={stats.totalAssignments} />
        <StatCard title="Completed Modules" value={stats.completedModules} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white border border-purple-200 p-6 rounded-xl shadow hover:shadow-md transition text-center">
    <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
    <p className="text-4xl font-bold text-purple-700 mt-3">
      {value ?? "--"}
    </p>
  </div>
);

export default AnalyticsPage;
