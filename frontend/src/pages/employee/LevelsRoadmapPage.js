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

  useEffect(() => {
    fetchLevels();
    // eslint-disable-next-line
  }, [moduleId, topicIndex]);

  const fetchLevels = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      // 🔐 FIX: First level is ALWAYS unlocked
      const normalizedLevels = (data.levels || []).map((lv, index) => ({
        ...lv,
        unlocked: index === 0 ? true : lv.unlocked,
      }));

      setLevels(normalizedLevels);
      setTopicTitle(data.topicTitle || "");
      setModuleTitle(data.moduleTitle || "");
    } catch (err) {
      console.error(err);
    }
  };

  const openLevel = (idx, lv) => {
    if (!lv.unlocked) return;
    navigate(`/modules/${moduleId}/topics/${topicIndex}/levels/${idx}`);
  };

  return (
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-3xl font-bold mb-4">{moduleTitle}</h1>
      <h2 className="text-2xl text-purple-300 mb-8">{topicTitle}</h2>

      <div className="flex items-start gap-6">
        {/* vertical line */}
        <div className="relative">
          <div
            style={{
              width: 4,
              background: "linear-gradient(#a78bfa,#7c3aed)",
              height: levels.length * 120,
            }}
          />
        </div>

        <div className="flex-1">
          {levels.map((lv, i) => (
            <div key={i} className="flex items-center gap-6 mb-8">
              {/* marker */}
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
                className={`p-6 rounded-xl ${
                  lv.completed
                    ? "bg-green-900"
                    : lv.unlocked
                    ? "bg-gray-800"
                    : "bg-gray-900/50"
                }`}
                style={{ width: "100%" }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {lv.number}. {lv.title}
                    </h3>
                    <p className="text-sm text-gray-400">XP: {lv.xp}</p>
                  </div>

                  <div>
                    {lv.completed ? (
                      <button className="px-4 py-2 bg-green-600 rounded">
                        Completed
                      </button>
                    ) : lv.unlocked ? (
                      <button
                        onClick={() => openLevel(i, lv)}
                        className="px-4 py-2 bg-purple-600 rounded"
                      >
                        Start
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 bg-gray-600 rounded cursor-not-allowed"
                        disabled
                      >
                        Locked
                      </button>
                    )}
                  </div>
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
