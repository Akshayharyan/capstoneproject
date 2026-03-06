import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ================= NAVBAR ================= */

function TrainerNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-12 py-4 flex justify-between items-center sticky top-0 z-50">

      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          SkillQuest
        </h1>

        <button
          onClick={() => navigate("/trainer")}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
        >
          My Modules
        </button>
      </div>

      <button
        onClick={logout}
        className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
}

/* ================= MAIN PAGE ================= */

export default function TrainerModulesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [achievementsByModule, setAchievementsByModule] = useState({});

  /* ================= LOAD MODULES ================= */

  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/trainer/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        const moduleList = Array.isArray(data)
          ? data
          : Array.isArray(data.modules)
          ? data.modules
          : [];

        setModules(moduleList);
      } catch (err) {
        console.error("Failed to load modules:", err);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [token]);

  /* ================= CREATE ACHIEVEMENT ================= */

  const createAchievement = async (moduleId, formData) => {
    const res = await fetch(
      "http://localhost:5000/api/trainer/achievements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          type: "MODULE_COMPLETE",
          moduleId,
        }),
      }
    );

    const data = await res.json();
    if (!data?.success) return;

    setAchievementsByModule((prev) => ({
      ...prev,
      [moduleId]: [data.achievement],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading modules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">

      <TrainerNavbar />

      <div className="px-14 py-16 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Trainer Command Center
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Configure modules, bosses and achievements.
          </p>
        </div>

        {modules.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow border text-center text-gray-500">
            No modules assigned yet.
          </div>
        )}

        {/* MODULE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {modules.map((m) => (
            <div
              key={m.moduleId}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >

              {/* MODULE INFO */}
              <div className="flex-1">

                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                    {m.title}
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                    {m.topicsCount || 0}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                  {m.description || "No description provided."}
                </p>

              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">

                <button
                  onClick={() =>
                    navigate(`/trainer/modules/${m.moduleId}/edit`)
                  }
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                >
                  Manage Topics
                </button>

                <button
                  onClick={() =>
                    navigate(`/trainer/modules/${m.moduleId}/boss`)
                  }
                  className="w-full py-2.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-semibold transition"
                >
                  Configure Boss
                </button>

              </div>

              {/* ACHIEVEMENT SECTION */}
              <div className="border-t mt-6 pt-5">

                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                  Module Achievement
                </h4>

                {achievementsByModule[m.moduleId]?.length > 0 ? (
                  <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm shadow">
                    <div className="text-2xl mb-1">
                      {achievementsByModule[m.moduleId][0].icon}
                    </div>
                    <h4 className="font-semibold">
                      {achievementsByModule[m.moduleId][0].title}
                    </h4>
                    <p className="text-xs opacity-90">
                      {achievementsByModule[m.moduleId][0].description}
                    </p>
                  </div>
                ) : (
                  <AddAchievementForm
                    onCreate={(data) =>
                      createAchievement(m.moduleId, data)
                    }
                  />
                )}

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

/* ================= ADD ACHIEVEMENT FORM ================= */

function AddAchievementForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🏆");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    await onCreate({ title, description, icon });
    setLoading(false);
    setTitle("");
    setDescription("");
    setIcon("🏆");
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border">

      <input
        className="w-full mb-2 p-2 border rounded-lg text-xs"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full mb-2 p-2 border rounded-lg text-xs"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded-lg text-xs"
        placeholder="Icon"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}