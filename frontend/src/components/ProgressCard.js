import React from "react";

function ProgressCard({ progress }) {
  return (
    <div className="p-6 rounded-xl bg-background-dark shadow-lg border border-gray-700 mb-8">
      <div className="flex justify-between mb-2">
        <p className="text-white font-semibold">Skill Completion</p>
        <p className="text-green-400 font-bold">{progress}%</p>
      </div>
      <div className="w-full bg-gray-700 h-3 rounded-full">
        <div
          className="bg-green-400 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        You're making great progress! Keep going 🚀
      </p>
    </div>
  );
}

export default ProgressCard;
