// src/pages/trainer/TrainerModulesPage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TrainerModulesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [achievementsByModule, setAchievementsByModule] = useState({});

  /* ================= FETCH ASSIGNED MODULES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/trainer/assigned", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setModules)
      .catch(console.error);
  }, [token]);

  /* ================= CREATE ACHIEVEMENT ================= */
  const createAchievement = async (moduleId, formData) => {
    const res = await fetch("http://localhost:5000/api/trainer/achievements", {
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
    });

    const data = await res.json();

    if (res.ok) {
      setAchievementsByModule((prev) => ({
        ...prev,
        [moduleId]: [data.achievement],
      }));
    }
  };

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-orange-500">
          Trainer Command Center
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Create modules, manage content, and reward learners with achievements.
        </p>
      </div>

      {modules.length === 0 && (
        <p className="text-gray-500">No modules assigned yet.</p>
      )}

      {/* Modules Grid (LEFT ALIGNED FIX) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modules.map((m) => (
          <div
            key={m.assignmentId}
            className="bg-white rounded-3xl p-6 border border-gray-200
                       shadow-sm hover:shadow-xl transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {m.title}
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                {m.topicsCount} Topics
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              {m.description || "No description provided."}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() =>
                  navigate(`/trainer/modules/${m.moduleId}/edit`)
                }
                className="flex-1 py-2.5 rounded-xl
                           bg-orange-500 hover:bg-orange-400
                           text-white font-semibold transition"
              >
                ✏️ Edit Content
              </button>

              <button
                className="px-4 py-2.5 rounded-xl border
                           text-gray-700 hover:bg-gray-50 transition"
              >
                👁 Preview
              </button>
            </div>

            {/* Achievement Section */}
            <div className="border-t pt-5">
              <h3 className="font-bold text-gray-800 mb-3">
                🏆 Module Achievement
              </h3>

              {/* Existing Achievement */}
              {achievementsByModule[m.moduleId]?.length > 0 ? (
                <div className="rounded-2xl p-4
                                bg-gradient-to-br from-indigo-500 to-purple-600
                                text-white shadow">
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
                  onCreate={(data) => createAchievement(m.moduleId, data)}
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
    if (!title.trim()) return;
    setLoading(true);
    await onCreate({ title, description, icon });
    setLoading(false);
    setTitle("");
    setDescription("");
    setIcon("🏆");
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border">
      <p className="font-semibold text-sm mb-2">
        Create Module Achievement
      </p>

      <input
        className="w-full mb-2 p-2 border rounded-lg text-sm"
        placeholder="Achievement title (e.g. Python Warrior)"
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
        placeholder="Icon (emoji)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2.5 rounded-xl
                   bg-indigo-600 hover:bg-indigo-500
                   text-white font-semibold transition"
      >
        {loading ? "Creating..." : "Forge Achievement"}
      </button>
    </div>
  );
}

export default TrainerModulesPage;
