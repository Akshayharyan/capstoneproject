import React from "react";
import { motion } from "framer-motion";
import { Heart, Zap } from "lucide-react";

export default function GameHUD({ gameState }) {
  const progressPercent =
    (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-slate-950/85 via-indigo-950/80 to-purple-950/80 p-5 md:p-6"
    >
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "linear-gradient(110deg, rgba(34,211,238,0.25), rgba(167,139,250,0.15), rgba(236,72,153,0.18))"
      }} />

      {/* Top Row: Progress & Info */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Lives */}
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={
                  i >= gameState.livesRemaining
                    ? { scale: 0.8, opacity: 0.4 }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={22}
                  className={
                    i < gameState.livesRemaining
                      ? "text-rose-400 fill-rose-500 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                      : "text-slate-500"
                  }
                />
              </motion.div>
            ))}
          </div>

          {/* Score */}
          <motion.div
            className="bg-amber-500/20 border border-amber-300/30 px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-300" />
              <span className="text-yellow-400 font-bold">
                {gameState.score} pts
              </span>
            </div>
          </motion.div>
        </div>

        {/* Accuracy */}
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-cyan-100/80 text-xs mb-1 uppercase tracking-[0.2em]">Accuracy</p>
          <motion.p
            className="text-2xl font-black text-cyan-300"
            key={gameState.accuracy}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {gameState.accuracy}%
          </motion.p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="relative space-y-2">
        <div className="flex justify-between text-xs text-cyan-100/80 mb-1 uppercase tracking-[0.18em]">
          <span>Progress</span>
          <span>
            {gameState.currentQuestionIndex + 1}/{gameState.totalQuestions}
          </span>
        </div>

        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Streak Counter */}
      {gameState.correctAnswers > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-4 py-2 rounded-full text-sm font-black"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            Combo: {gameState.correctAnswers}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
