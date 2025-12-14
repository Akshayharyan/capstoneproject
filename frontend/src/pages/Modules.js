import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Modules() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/modules/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId) => {
    await fetch("http://localhost:5000/api/modules/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId }),
    });
    fetchModules();
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0b1020] text-white px-10 py-8">
      <h1 className="text-4xl font-bold mb-2 text-blue-400">
        Learning Modules
      </h1>
      <p className="mb-10 text-gray-400">
        Start learning, continue where you left off, and master skills 🚀
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((mod) => (
          <div
            key={mod._id}
            className="rounded-2xl p-6 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-2">{mod.title}</h2>
            <p className="text-gray-200 mb-6 text-sm">{mod.description}</p>

            {mod.status === "not_started" && (
              <button
                onClick={() => startModule(mod._id)}
                className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold"
              >
                Start Module
              </button>
            )}

            {mod.status === "in_progress" && (
              <button
                onClick={() => navigate(`/modules/${mod._id}/topics`)}
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold"
              >
                Continue Learning
              </button>
            )}

            {mod.status === "completed" && (
              <button
                disabled
                className="w-full py-2 bg-gray-600 rounded-lg font-semibold cursor-not-allowed"
              >
                Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modules;
