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
      className="pointer-events-auto w-full max-w-3xl rounded-3xl border border-amber-900/40 bg-[linear-gradient(180deg,rgba(67,47,27,0.95),rgba(33,23,12,0.95))] p-4 shadow-[0_12px_34px_rgba(12,8,4,0.6)] backdrop-blur-md md:max-w-[31rem] md:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-amber-200/35 bg-amber-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-100">
          Checkpoint Gate
        </span>
        <span className="rounded-full border border-orange-200/35 bg-orange-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-100">
          Answer to Unlock
        </span>
      </div>

      <h2 className="mb-4 text-base font-bold leading-relaxed text-amber-50 md:text-lg">{question.question}</h2>

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
                  ? "border-red-300/80 bg-red-500/20"
                  : correctOption
                  ? "border-emerald-300/90 bg-emerald-500/20"
                  : selected
                  ? "border-amber-200/90 bg-amber-500/20"
                  : "border-amber-100/20 bg-black/20 hover:border-amber-200/60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-100/35 bg-amber-100/10 text-sm font-bold text-amber-50">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-amber-50/95 md:text-[15px]">{option}</span>
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
              : "border-red-300/40 bg-red-500/15 text-red-100"
          }`}
        >
          {isCorrect ? "Gate unlocked. Climb to the next platform." : "Wrong answer. You lost 1 life."}
        </motion.div>
      )}
    </motion.div>
  );
}
