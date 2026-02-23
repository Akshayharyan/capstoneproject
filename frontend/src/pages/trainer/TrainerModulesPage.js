import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading modules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-10 py-12">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-orange-500">
          Trainer Command Center
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your learning modules and achievements.
        </p>
      </div>

      {/* EMPTY STATE */}
      {modules.length === 0 && (
        <div className="bg-white p-8 rounded-2xl shadow border text-center text-gray-500">
          No modules assigned yet.
        </div>
      )}

      {/* MODULE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {modules.map((m) => (
          <div
            key={m.moduleId}
            className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >

            {/* MODULE INFO */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {m.title}
                </h2>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  {m.topicsCount || 0} Topics
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                {m.description || "No description provided."}
              </p>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() =>
                navigate(`/trainer/modules/${m.moduleId}/edit`)
              }
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
            >
              Manage Module
            </button>

            {/* ACHIEVEMENT SECTION */}
            <div className="border-t pt-5 mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                🏆 Module Achievement
              </h3>

              {achievementsByModule[m.moduleId]?.length > 0 ? (
                <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
                  <div className="text-3xl mb-1">
                    {achievementsByModule[m.moduleId][0].icon}
                  </div>
                  <h4 className="font-bold">
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
    <div className="bg-gray-50 rounded-2xl p-4 border">

      <input
        className="w-full mb-2 p-2 border rounded-lg text-sm"
        placeholder="Achievement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full mb-2 p-2 border rounded-lg text-sm"
        placeholder="Short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded-lg text-sm"
        placeholder="Icon emoji"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
      >
        {loading ? "Creating..." : "Create Achievement"}
      </button>

    </div>
  );
}