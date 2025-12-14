import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LevelsRoadmapPage = () => {
  const { moduleId, topicIndex } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
    // eslint-disable-next-line
  }, [moduleId, topicIndex]);

  // =========================
  // FETCH LEVELS (BACKEND TRUTH)
  // =========================
  const fetchLevels = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load levels");

      setLevels(Array.isArray(data.levels) ? data.levels : []);
      setTopicTitle(data.topicTitle || "");
      setModuleTitle(data.moduleTitle || "");
    } catch (err) {
      console.error("Fetch levels error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openLevel = (index, level) => {
    if (!level.unlocked && !level.completed) return;
    navigate(`/modules/${moduleId}/topics/${topicIndex}/levels/${index}`);
  };

  if (loading)
    return <div className="text-white p-10">Loading levels...</div>;

  return (
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-3xl font-bold mb-2">{moduleTitle}</h1>
      <h2 className="text-2xl text-purple-300 mb-10">{topicTitle}</h2>

      <div className="flex gap-8">
        {/* Timeline */}
        <div className="relative">
          <div
            style={{
              width: 4,
              height: levels.length * 110,
              background: "linear-gradient(#a78bfa,#7c3aed)",
            }}
          />
        </div>

        {/* Levels */}
        <div className="flex-1">
          {levels.map((lv, i) => (
            <div key={i} className="flex items-center gap-6 mb-10">
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: lv.completed
                    ? "#10b981"
                    : lv.unlocked
                    ? "#7c3aed"
                    : "#374151",
                }}
              />

              <div
                className={`w-full p-6 rounded-xl ${
                  lv.completed
                    ? "bg-green-900/70 hover:bg-green-900 cursor-pointer"
                    : lv.unlocked
                    ? "bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    : "bg-gray-900/50"
                }`}
                onClick={() => openLevel(i, lv)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {lv.number}. {lv.title}
                    </h3>
                    <p className="text-sm text-gray-400">XP: {lv.xp}</p>
                  </div>

                  {lv.completed ? (
                    <button className="px-4 py-2 bg-green-600 rounded">
                      Revisit
                    </button>
                  ) : lv.unlocked ? (
                    <button className="px-4 py-2 bg-purple-600 rounded">
                      Start
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-600 rounded"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelsRoadmapPage;
