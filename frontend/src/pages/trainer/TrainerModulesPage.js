// frontend/src/pages/trainer/TrainerModulesPage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TrainerModulesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trainer/assigned", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch(console.error);
  }, [token]);

  return (
  <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
    {/* Page Content Wrapper */}
    <div className="px-10 py-10 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">
          My Modules
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Create and manage learning content for your assigned modules.
        </p>
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <p className="text-gray-500">No modules assigned yet.</p>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((m, index) => (
          <div
            key={m.assignmentId}
            className="bg-white rounded-2xl p-6
                       border border-gray-200
                       shadow-sm hover:shadow-lg
                       transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            {/* Accent Bar */}
            <div className="h-1 w-16 bg-orange-400 rounded-full mb-4" />

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {m.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {m.description || "No description provided."}
            </p>

            <p className="text-sm text-indigo-500 mb-6">
              Topics:{" "}
              <span className="font-semibold text-gray-800">
                {m.topicsCount}
              </span>
            </p>

            <button
              onClick={() =>
                navigate(`/trainer/modules/${m.moduleId}/edit`)
              }
              className="w-full py-2.5 rounded-lg
                         bg-orange-500 hover:bg-orange-400
                         text-white font-semibold
                         transition"
            >
              Edit Topics & Content
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Animation */}
    <style>
      {`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
          opacity: 0;
        }
      `}
    </style>
  </div>
);
}

export default TrainerModulesPage;
