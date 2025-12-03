// frontend/src/pages/Modules.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Modules() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch modules from backend
  const fetchModules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/modules", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) setModules(data.modules);
      else console.error("Module fetch error:", data);
    } catch (err) {
      console.error("Fetch modules error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, []);

  // Start module + move user to quest page
  const startModule = async (moduleId) => {
    try {
      const res = await fetch("http://localhost:5000/api/modules/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Module started! Added to your dashboard.");
        navigate(`/modules/${moduleId}/quests`);
      } else {
        alert(data.message || "Error starting module");
      }
    } catch (err) {
      console.error("Module start error:", err);
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-blue-400">Learning Modules</h1>
      <p className="mb-8 text-gray-300">
        Explore structured modules to enhance your skills. Start a module to earn XP and complete quests!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div
            key={mod._id}
            className="relative rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            {/* XP Badge */}
            <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              ★ {mod.xp || 0} XP
            </span>

            <h2 className="text-xl font-semibold mb-2">{mod.title}</h2>
            <p className="text-gray-200 text-sm mb-4">{mod.description}</p>

            <button
              onClick={() => startModule(mod._id)}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Start Module
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modules;
