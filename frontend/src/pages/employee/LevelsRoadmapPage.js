import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LevelsRoadmapPage = () => {
  const { moduleId, topicIndex } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    fetchLevels();
    // eslint-disable-next-line
  }, [moduleId, topicIndex]);

  const fetchLevels = async () => {
    const res = await fetch(
      `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    let lvls = data.levels || [];
    lvls.sort((a, b) => a.number - b.number);

    lvls = lvls.map((lv, i, arr) => ({
      ...lv,
      unlocked: i === 0 || arr[i - 1]?.completed,
    }));

    setLevels(lvls);
    setTopicTitle(data.topicTitle);
    setModuleTitle(data.moduleTitle);
  };

  const openLevel = (index, level) => {
    if (!level.unlocked && !level.completed) return;
    navigate(`/modules/${moduleId}/topics/${topicIndex}/levels/${index}`);
  };

  return (
    <div className="min-h-screen p-10 text-white animate-fade-in">
      <h1 className="text-3xl font-bold mb-1">{moduleTitle}</h1>
      <h2 className="text-purple-400 mb-20">
        🧭 Learning Path · {topicTitle}
      </h2>

      {/* PATH WRAPPER */}
      <div className="relative flex justify-center">
        {/* CENTRAL VERTICAL PATH */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-purple-800 rounded-full" />

        <div className="flex flex-col gap-28 w-full relative z-10">
          {levels.map((lv, i) => {
            const isLeft = i % 2 === 0;
            const isCurrent = lv.unlocked && !lv.completed;

            return (
              <div key={i} className="relative h-20">
                {/* LEFT NODE */}
                {isLeft && (
                  <>
                    {/* CONNECTOR */}
                    <div className="absolute top-1/2 left-[calc(50%-96px)] w-24 h-1 bg-purple-600" />

                    {/* NODE */}
                    <div
                      className="absolute top-1/2 left-[calc(50%-160px)] -translate-y-1/2"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <HexNode
                        level={lv}
                        isCurrent={isCurrent}
                        onClick={() => openLevel(i, lv)}
                      />

                      {activeIndex === i && (
                        <PopupCard
                          title={lv.title}
                          action={() => openLevel(i, lv)}
                          completed={lv.completed}
                          side="left"
                        />
                      )}
                    </div>
                  </>
                )}

                {/* RIGHT NODE */}
                {!isLeft && (
                  <>
                    {/* CONNECTOR */}
                    <div className="absolute top-1/2 left-1/2 w-24 h-1 bg-purple-600" />

                    {/* NODE */}
                    <div
                      className="absolute top-1/2 left-[calc(50%+96px)] -translate-y-1/2"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <HexNode
                        level={lv}
                        isCurrent={isCurrent}
                        onClick={() => openLevel(i, lv)}
                      />

                      {activeIndex === i && (
                        <PopupCard
                          title={lv.title}
                          action={() => openLevel(i, lv)}
                          completed={lv.completed}
                          side="right"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================
   HEX NODE COMPONENT
   ========================= */
const HexNode = ({ level, isCurrent, onClick }) => (
  <div
    onClick={onClick}
    className={`w-20 h-20 flex items-center justify-center text-xl font-bold cursor-pointer transition-transform
      ${
        level.completed
          ? "bg-green-600"
          : isCurrent
          ? "bg-purple-600 animate-pulse-glow"
          : level.unlocked
          ? "bg-gray-500"
          : "bg-gray-800 opacity-50"
      }
    `}
    style={{
      clipPath:
        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    }}
  >
    {level.completed ? "⭐" : level.number}
  </div>
);

/* =========================
   POPUP CARD
   ========================= */
const PopupCard = ({ title, action, completed, side }) => (
  <div
    className={`absolute top-1/2 -translate-y-1/2 w-56 bg-gray-900 border border-purple-600 rounded-xl shadow-xl p-4 animate-pop
      ${side === "left" ? "right-24" : "left-24"}
    `}
  >
    <p className="font-semibold mb-3">{title}</p>
    <button
      onClick={action}
      className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
    >
      {completed ? "Revisit" : "Start"}
    </button>
  </div>
);

export default LevelsRoadmapPage;
