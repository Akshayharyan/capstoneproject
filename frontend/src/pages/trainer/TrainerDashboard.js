import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const navigate = useNavigate();

  // TEMP: Replace with API later
  const [stats, setStats] = useState({
    modules: 3,
    learners: 434,
    levels: 28,
  });

  const [modules, setModules] = useState([
    {
      id: "1",
      title: "React Fundamentals",
      duration: "3 hours",
      topics: 8,
      levels: 12,
      enrolled: 245,
      status: "Published",
    },
    {
      id: "2",
      title: "TypeScript Basics",
      duration: "2.5 hours",
      topics: 6,
      levels: 9,
      enrolled: 189,
      status: "Published",
    },
    {
      id: "3",
      title: "API Integration",
      duration: "4 hours",
      topics: 5,
      levels: 7,
      enrolled: 0,
      status: "Draft",
    },
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Modules</h1>
        <p className="text-gray-500 mt-1">
          Manage your assigned learning modules
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Modules" value={stats.modules} />
        <StatCard label="Learners" value={stats.learners} />
        <StatCard label="Levels" value={stats.levels} />
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between"
          >
            {/* Status */}
            <span
              className={`text-xs px-3 py-1 rounded-full w-fit mb-4 ${
                module.status === "Published"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {module.status}
            </span>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">
              {module.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{module.duration}</p>

            {/* Metrics */}
            <div className="flex justify-between text-sm text-gray-600 mb-6">
              <Metric label="Topics" value={module.topics} />
              <Metric label="Levels" value={module.levels} />
              <Metric label="Enrolled" value={module.enrolled} />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/trainer/edit-topics/${module.id}`)}
                className="flex-1 border border-teal-500 text-teal-600 py-2 rounded-lg hover:bg-teal-50"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => navigate(`/trainer/preview/${module.id}`)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100"
              >
                👁 Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    <p className="text-gray-500 mt-1">{label}</p>
  </div>
);

const Metric = ({ label, value }) => (
  <div className="text-center">
    <p className="font-semibold">{value}</p>
    <p className="text-xs">{label}</p>
  </div>
);

export default TrainerDashboard;
