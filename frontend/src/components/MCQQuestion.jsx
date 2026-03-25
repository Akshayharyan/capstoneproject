import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function MCQQuestion({
  question,
  onAnswerSelect,
  selectedAnswer,
  isSubmitted,
  isCorrect,
}) {
  if (!question) {
    return (
      <div className="text-center text-purple-300">Loading question...</div>
    );
  }

  const answerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-fuchsia-300/30 bg-gradient-to-br from-slate-900/80 via-purple-950/70 to-indigo-950/70 p-6"
      >
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: "linear-gradient(120deg, rgba(34,211,238,0.18), rgba(236,72,153,0.15), rgba(251,191,36,0.12))"
        }} />
        <div className="relative flex items-center justify-between gap-3 mb-3">
          <span className="rounded-full border border-cyan-300/40 bg-cyan-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-100">
            Gate Prompt
          </span>
          <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-fuchsia-100">
            Choose One
          </span>
        </div>
        <h2 className="text-xl font-bold text-white leading-relaxed">
          {question.question}
        </h2>
      </motion.div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = isCorrect && index === question.correctIndex;
          const isWrongSelected =
            isSelected && !isCorrect && isSubmitted;
          const optionLabel = String.fromCharCode(65 + index);

          return (
            <motion.button
              key={index}
              variants={answerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 + index * 0.1 }}
              onClick={() => !isSubmitted && onAnswerSelect(index)}
              disabled={isSubmitted}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden
                ${
                  isSelected && isSubmitted
                    ? isCorrect
                      ? "border-green-500 bg-green-500/20"
                      : "border-red-500 bg-red-500/20"
                    : isCorrectOption
                    ? "border-green-500 bg-green-500/20"
                    : isSubmitted
                    ? "border-purple-500/30 bg-purple-950/30"
                    : "border-purple-500/30 bg-purple-950/50 hover:border-purple-500 hover:bg-purple-900/50 cursor-pointer"
                }
              `}
              whileHover={!isSubmitted ? { scale: 1.02, x: 8 } : {}}
              whileTap={!isSubmitted ? { scale: 0.98 } : {}}
            >
              {!isSubmitted && (
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10" />
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="h-8 w-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-sm font-black text-white/90">
                    {optionLabel}
                  </span>
                  <p className="text-white font-medium">{option}</p>
                </div>

                {isSubmitted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    {isCorrectOption ? (
                      <CheckCircle size={24} className="text-green-400" />
                    ) : isWrongSelected ? (
                      <XCircle size={24} className="text-red-400" />
                    ) : null}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center py-4 rounded-xl font-bold text-lg border-2 ${
            isCorrect
              ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.25)]"
              : "bg-rose-500/20 text-rose-200 border-rose-400/60 shadow-[0_0_25px_rgba(251,113,133,0.25)]"
          }`}
        >
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              Gate Opened! +10 Points
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <XCircle size={20} />
              Gate Shocked You! Life Lost
            </div>
          )}
        </motion.div>
      )}

      {/* Submit Button */}
      {selectedAnswer !== null && !isSubmitted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onAnswerSelect(selectedAnswer)}
          className="w-full py-3 bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 hover:from-fuchsia-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/40"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Breach Checkpoint
        </motion.button>
      )}
    </motion.div>
  );
}
