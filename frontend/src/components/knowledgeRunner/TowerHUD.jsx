import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function TowerHUD({ gameState, moduleName, soundEnabled, onToggleSound }) {
  const total = Math.max(gameState.totalQuestions || 1, 1);
  const stage = (gameState.currentQuestionIndex || 0) + 1;
  const progressPercent = Math.min(100, Math.round((stage / total) * 100));

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-3">
        <div className="pointer-events-auto rounded-2xl border border-amber-200/25 bg-[rgba(37,24,12,0.82)] px-3 py-2.5 backdrop-blur-md md:px-4 md:py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-100/80">Knowledge Runner</p>
          <p className="mt-1 max-w-[72vw] truncate text-base font-bold text-amber-50 md:max-w-md md:text-lg">{moduleName}</p>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200/25 bg-[rgba(37,24,12,0.82)] px-3 py-2.5 backdrop-blur-md md:px-4 md:py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} animate={i < gameState.livesRemaining ? { scale: [1, 1.08, 1] } : { scale: 0.82, opacity: 0.4 }} transition={{ duration: 0.4 }}>
              <Heart className={i < gameState.livesRemaining ? "h-5 w-5 fill-red-500 text-red-300" : "h-5 w-5 text-stone-500"} />
            </motion.div>
          ))}
          <div className="mx-1 h-6 w-px bg-amber-100/20 md:mx-2" />
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-bold text-amber-100">{gameState.score || 0} XP</span>
          <div className="mx-1 h-6 w-px bg-amber-100/20 md:mx-2" />
          <span className="text-sm font-semibold text-amber-50">Stage {stage}/{total}</span>
          <button onClick={onToggleSound} className="ml-auto rounded-lg border border-amber-100/25 bg-amber-950/30 p-2 text-amber-50 hover:bg-amber-900/45 md:ml-2" aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}>
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-2.5 w-full max-w-7xl rounded-full border border-amber-200/25 bg-[rgba(37,24,12,0.72)] p-1 backdrop-blur-md md:mt-3">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-red-400"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
