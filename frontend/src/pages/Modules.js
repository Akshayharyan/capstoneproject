// frontend/src/pages/Modules.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Modules() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/modules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setModules(data.modules || []);
      } catch (err) {
        console.error("Fetch modules error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [token]);

  if (loading)
    return <div className="text-white text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-6">
      <h1 className="text-3xl font-semibold mb-6 text-blue-400">Learning Modules</h1>
      <p className="mb-8 text-gray-300">
        Select a module to begin your structured learning journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div
            key={mod._id}
            onClick={() => navigate(`/modules/${mod._id}/topics`)}
            className="relative rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            {/* XP badge */}
            <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              ★ {mod.xp || 0} XP
            </span>

            <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
            <p className="text-gray-200 text-sm">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modules;
