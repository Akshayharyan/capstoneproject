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
      console.error("Failed to fetch modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (mod) => {
    if (mod.status === "not_started") {
      await fetch("http://localhost:5000/api/modules/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId: mod._id }),
      });
      fetchModules();
    } else {
      navigate(`/modules/${mod._id}/topics`);
    }
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-500 animate-pulse">
          Loading modules…
        </p>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-[#f8fbfb] px-10 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Learning Modules
        </h1>
        <p className="text-slate-600 mt-1">
          Start learning, continue where you left off 🚀
        </p>
      </div>

      {/* STATS */}
      <div className="mb-10 bg-white rounded-2xl shadow-sm p-5 flex items-center gap-10">
        <div className="text-slate-700 font-medium">
          📘 {modules.length} Total Modules
        </div>
        <div className="text-slate-700 font-medium">
          ⚡ {modules.reduce((a, m) => a + (m.xp || 0), 0)} XP Available
        </div>
      </div>

      {/* MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((mod, index) => {
          const status = mod.status; // not_started | in_progress | completed
          const completed = status === "completed";
          const progress = mod.progress || 0;

          return (
            <div
              key={mod._id}
              className={`
                bg-[#f3fbfa]
                border rounded-2xl p-6
                shadow-sm hover:shadow-lg
                hover:-translate-y-1 transition-all duration-300
                animate-fade-in
                ${completed ? "border-green-300" : "border-teal-200"}
              `}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600 font-medium">
                  {mod.category || "General"}
                </span>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${
                      completed
                        ? "bg-green-100 text-green-700"
                        : "bg-teal-100 text-teal-700"
                    }
                  `}
                >
                  {completed ? "Completed" : "In Progress"}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {mod.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {mod.description}
              </p>

              {/* META */}
              <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <span>⏱ {mod.duration || "3 hours"}</span>
                <span>👥 {mod.learners || 120}</span>
              </div>

              {/* PROGRESS */}
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 bg-teal-100 rounded-full overflow-hidden mb-5">
                <div
                  className={`h-full rounded-full transition-all duration-500
                    ${completed ? "bg-green-500" : "bg-teal-500"}
                  `}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-yellow-400 text-white text-sm font-semibold">
                  ⚡ {mod.xp || 200} XP
                </span>

                <button
                  onClick={() => handleAction(mod)}
                  className={`
                    px-5 py-2 rounded-xl text-sm font-semibold transition
                    ${
                      status === "completed"
                        ? "text-slate-600 hover:text-slate-900"
                        : status === "not_started"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-teal-500 hover:bg-teal-600 text-white"
                    }
                  `}
                >
                  {status === "completed"
                    ? "Review"
                    : status === "not_started"
                    ? "Start"
                    : "Continue"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Modules;
