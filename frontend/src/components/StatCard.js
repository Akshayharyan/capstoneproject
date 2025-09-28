import React from "react";

function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-background-dark rounded-xl shadow-lg text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-4xl font-bold text-purple-400">{value}</p>
    </div>
  );
}

export default StatCard;
