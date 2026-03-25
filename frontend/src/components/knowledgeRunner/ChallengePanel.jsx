import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ChallengePanel({
  question,
  selectedAnswer,
  isSubmitted,
  isCorrect,
  onAnswerSelect,
}) {
  if (!question) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="pointer-events-auto w-full max-w-2xl md:max-w-xl rounded-3xl border border-fuchsia-300/30 bg-slate-900/84 p-4 shadow-[0_0_40px_rgba(217,70,239,0.25)] backdrop-blur-md md:p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-cyan-300/40 bg-cyan-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-cyan-100">
          Checkpoint Gate
        </span>
        <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-fuchsia-100">
          Answer to Unlock
        </span>
      </div>

      <h2 className="mb-4 text-base font-bold leading-relaxed text-white md:text-lg">{question.question}</h2>

      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const selected = selectedAnswer === index;
          const wrongSelected = selected && isSubmitted && !isCorrect;
          const correctOption = isSubmitted && index === question.correctIndex;
          const label = String.fromCharCode(65 + index);

          return (
            <motion.button
              key={index}
              whileHover={!isSubmitted ? { scale: 1.01, x: 6 } : {}}
              whileTap={!isSubmitted ? { scale: 0.99 } : {}}
              disabled={isSubmitted}
              onClick={() => !isSubmitted && onAnswerSelect(index)}
              className={`w-full rounded-xl border-2 px-3 py-3 text-left transition ${
                wrongSelected
                  ? "border-rose-400 bg-rose-500/20"
                  : correctOption
                  ? "border-emerald-400 bg-emerald-500/20"
                  : selected
                  ? "border-cyan-300 bg-cyan-500/20"
                  : "border-white/15 bg-white/5 hover:border-cyan-300/60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/10 text-sm font-bold text-white">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-white/95 md:text-[15px]">{option}</span>
                </div>

                {isSubmitted && correctOption && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}
                {isSubmitted && wrongSelected && <XCircle className="h-5 w-5 text-rose-300" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl border px-3 py-3 text-sm font-semibold ${
            isCorrect
              ? "border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
              : "border-rose-300/40 bg-rose-500/15 text-rose-100"
          }`}
        >
          {isCorrect ? "Gate unlocked. Climb to the next platform." : "Wrong answer. You lost 1 life."}
        </motion.div>
      )}
    </motion.div>
  );
}
