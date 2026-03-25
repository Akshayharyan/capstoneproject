import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Volume2, VolumeX } from "lucide-react";

export default function TowerHUD({ gameState, moduleName, soundEnabled, onToggleSound }) {
  const total = Math.max(gameState.totalQuestions || 1, 1);
  const stage = (gameState.currentQuestionIndex || 0) + 1;
  const progressPercent = Math.min(100, Math.round((stage / total) * 100));

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 px-4 pt-4 md:px-6 md:pt-5">
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-3">
        <div className="pointer-events-auto rounded-2xl border border-cyan-300/20 bg-slate-900/65 px-4 py-3 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/80">Knowledge Runner</p>
          <p className="mt-1 text-lg font-bold text-white">{moduleName}</p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-slate-900/65 px-4 py-3 backdrop-blur-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} animate={i < gameState.livesRemaining ? { scale: [1, 1.08, 1] } : { scale: 0.82, opacity: 0.4 }} transition={{ duration: 0.4 }}>
              <Heart className={i < gameState.livesRemaining ? "h-5 w-5 fill-rose-500 text-rose-400" : "h-5 w-5 text-slate-500"} />
            </motion.div>
          ))}
          <div className="mx-2 h-6 w-px bg-white/15" />
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-bold text-amber-200">{gameState.score || 0} XP</span>
          <div className="mx-2 h-6 w-px bg-white/15" />
          <span className="text-sm font-semibold text-cyan-100">Stage {stage}/{total}</span>
          <button onClick={onToggleSound} className="ml-2 rounded-lg border border-white/15 bg-white/10 p-2 text-white hover:bg-white/20">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-3 w-full max-w-7xl rounded-full border border-cyan-300/20 bg-slate-900/60 p-1 backdrop-blur-md">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
