import React from "react";
import { motion } from "framer-motion";
import { Star, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quests = [
  { id: 1, title: "Intro to HTML", status: "Completed", xp: 10 },
  { id: 2, title: "Forms & Inputs", status: "Completed", xp: 15 },
  { id: 3, title: "Links & Images", status: "Completed", xp: 10 },
  { id: 4, title: "Semantic HTML", status: "In Progress", xp: 20 },
  { id: 5, title: "Tables & Lists", status: "Locked", xp: 10 },
  { id: 6, title: "Audio & Video", status: "Locked", xp: 15 },
  { id: 7, title: "Meta & SEO", status: "Locked", xp: 15 },
  { id: 8, title: "Final Challenge", status: "Locked", xp: 30 },
];

const QuestMap = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-[Poppins]">
      {/* Background image - fixed behind everything */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2070&q=80')",
          filter: "brightness(0.7)",
          zIndex: -1,
        }}
      ></div>

      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 z-0"></div>

      {/* Main content - starts BELOW navbar */}
      <div className="relative z-10 pt-20 pb-20"> {/* Increased top padding */}
        <div className="flex flex-col items-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-4 drop-shadow-lg font-[MedievalSharp] text-center">
            HTML Basics Quest Path ⚔️
          </h1>
          <p className="text-gray-200 mb-12 md:mb-16 max-w-xl text-center">
            Advance through your HTML journey by completing quests to earn XP and
            unlock new challenges!
          </p>

          {/* Quest Map */}
          <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center space-y-16 md:space-y-20">
            {quests.map((quest, index) => {
              const isCompleted = quest.status === "Completed";
              const isCurrent = quest.status === "In Progress";

              return (
                <div
                  key={quest.id}
                  className="relative flex flex-col items-center group"
                >
                  {/* Connecting glowing line */}
                  {index < quests.length - 1 && (
                    <svg
                      className="absolute top-full left-1/2 -translate-x-1/2 z-0"
                      width="8"
                      height="120"
                      viewBox="0 0 8 120"
                    >
                      <path
                        d="M4 0 C6 30 2 90 4 120"
                        stroke={
                          isCompleted ? "#4ade80" : isCurrent ? "#60a5fa" : "#6b7280"
                        }
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                      />
                    </svg>
                  )}

                  {/* Quest Node */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col justify-center items-center text-center shadow-2xl border-4 transition-all duration-300 cursor-pointer ${
                      isCompleted
                        ? "bg-green-600 border-green-400"
                        : isCurrent
                        ? "bg-blue-600 border-blue-400 animate-pulse"
                        : "bg-gray-700 border-gray-500 opacity-90"
                    }`}
                    onClick={() => {
                      if (isCompleted || isCurrent) {
                        // Add navigation to quest here
                        console.log(`Navigate to quest: ${quest.title}`);
                      }
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle size={24} className="text-green-300 mb-1" />
                    ) : isCurrent ? (
                      <Star size={24} className="text-yellow-300 mb-1" />
                    ) : (
                      <Lock size={24} className="text-gray-300 mb-1" />
                    )}
                    <p className="text-xs md:text-sm font-semibold text-white px-2">
                      {quest.title}
                    </p>
                    <p className="text-xs text-gray-200 mt-1">+{quest.xp} XP</p>
                  </motion.div>

                  {/* Status Badge */}
                  <div
                    className={`absolute -top-2 -right-2 md:-top-3 md:-right-3 px-2 py-1 rounded-full text-xs font-bold text-white ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {quest.status === "Completed"
                      ? "✓"
                      : quest.status === "In Progress"
                      ? "→"
                      : "🔒"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/modules")}
            className="mt-16 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold text-black shadow-lg hover:shadow-yellow-400/30 border-2 border-yellow-700 transition-all"
          >
            🏰 Back to Modules
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QuestMap;