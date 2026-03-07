import React from "react";
import { useNavigate } from "react-router-dom";

export default function BattleResult({
  type,
  bossName,
  xp = 300,
  onRestart
}) {

  const navigate = useNavigate();

  const victory = type === "victory";

  return (

    <div className="min-h-screen bg-black flex items-center justify-center text-white relative overflow-hidden">

      {/* Glow Background */}

      <div
        className={`absolute w-[600px] h-[600px] blur-[200px] opacity-30 animate-pulse ${
          victory ? "bg-yellow-500" : "bg-red-600"
        }`}
      />

      <div className="relative z-10 text-center">

        {/* TITLE */}

        <h1
          className={`text-7xl font-extrabold mb-6 ${
            victory ? "text-yellow-400" : "text-red-500"
          }`}
        >
          {victory ? "🏆 VICTORY" : "💀 DEFEAT"}
        </h1>

        {/* MESSAGE */}

        <p className="text-2xl text-gray-300 mb-6">

          {victory
            ? `${bossName} has been defeated!`
            : "You were defeated by the boss."}

        </p>

        {/* XP PANEL */}

        {victory && (

          <div className="bg-gray-900 border border-yellow-400 rounded-xl px-10 py-6 mb-8">

            <p className="text-xl text-yellow-300 font-bold">
              +{xp} XP Earned
            </p>

            <p className="text-gray-400 mt-2">
              Training Module Completed
            </p>

          </div>

        )}

        {/* BUTTONS */}

        <div className="flex flex-col md:flex-row gap-4 justify-center">

          {/* Restart */}

          <button
            onClick={onRestart}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            🔁 Restart Battle
          </button>

          {/* Topics */}

          <button
            onClick={() => navigate("/topics")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
          >
            📚 Back to Topics
          </button>

        </div>

      </div>

    </div>

  );

}