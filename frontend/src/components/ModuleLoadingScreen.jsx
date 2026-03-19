import React from "react";

export default function ModuleLoadingScreen({
  title = "Loading",
  subtitle = "Preparing your lesson...",
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-8">
        <div className="h-28 w-28 rounded-full border-4 border-indigo-100" />
        <div className="absolute inset-0 m-auto h-28 w-28 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white shadow-xl" />
      </div>

      <p className="text-sm uppercase tracking-[0.4em] text-indigo-400 mb-4">
        Syncing
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-xl">{subtitle}</p>
    </div>
  );
}
