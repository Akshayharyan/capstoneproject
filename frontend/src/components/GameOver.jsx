import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  DownloadCloud,
  RotateCcw,
  Home,
  Share2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function GameOver({
  status,
  results,
  moduleName,
  onRetry,
  onDownloadCertificate,
  onExit,
}) {
  const [showConfetti, setShowConfetti] = useState(status === "victory");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (status === "victory") {
      // Trigger confetti
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const isVictory = status === "victory";
  const canDownload = isVictory && Boolean(results?.certificateId) && Boolean(onDownloadCertificate);
  const messageColor = isVictory ? "text-green-400" : "text-red-400";
  const bgColor = isVictory ? "from-green-900 to-emerald-900" : "from-red-900 to-red-800";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ y: 500, opacity: 0, rotate: 360 }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 0.5,
              }}
              className="fixed w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
              style={{
                left: Math.random() * 100 + "%",
              }}
            />
          ))}
        </>
      )}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-slate-900/80 backdrop-blur-md border-2 border-purple-500/50 rounded-3xl p-8 text-center">
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="mb-6"
          >
            {isVictory ? (
              <Trophy size={64} className="mx-auto text-yellow-400" />
            ) : (
              <XCircle size={64} className="mx-auto text-red-400" />
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            className={`text-5xl font-bold mb-4 ${messageColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isVictory ? "🎉 Victory! 🎉" : "💀 Game Over"}
          </motion.h1>

          {/* Module Name */}
          <motion.p
            className="text-purple-300 text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {moduleName}
          </motion.p>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-950/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Score */}
              <div className="p-4 bg-purple-900/50 rounded-lg">
                <p className="text-purple-300 text-sm mb-1">Score</p>
                <motion.p
                  className="text-3xl font-bold text-purple-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {results?.score || 0}
                </motion.p>
              </div>

              {/* Accuracy */}
              <div className="p-4 bg-purple-900/50 rounded-lg">
                <p className="text-purple-300 text-sm mb-1">Accuracy</p>
                <motion.p
                  className="text-3xl font-bold text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  {results?.accuracy || 0}%
                </motion.p>
              </div>

              {/* Questions Answered */}
              <div className="p-4 bg-purple-900/50 rounded-lg">
                <p className="text-purple-300 text-sm mb-1">Answered</p>
                <motion.p
                  className="text-3xl font-bold text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {results?.correctAnswers || 0}/{results?.totalQuestions || 0}
                </motion.p>
              </div>

              {/* Time Spent */}
              <div className="p-4 bg-purple-900/50 rounded-lg">
                <p className="text-purple-300 text-sm mb-1">Time</p>
                <motion.p
                  className="text-3xl font-bold text-yellow-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {Math.floor((results?.timeSpent || 0) / 60)}m
                </motion.p>
              </div>
            </div>

            {/* Certificate Info */}
            {isVictory && results?.certificateId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg flex items-center gap-2"
              >
                <CheckCircle size={20} className="text-green-400" />
                <span className="text-green-300 text-sm">
                  Certificate unlocked! Download it below.
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            {isVictory ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (!canDownload || downloading) return;
                    setDownloading(true);
                    try {
                      await onDownloadCertificate();
                    } finally {
                      setDownloading(false);
                    }
                  }}
                  disabled={!canDownload || downloading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <DownloadCloud size={20} />
                  {downloading ? "Downloading..." : "Download Certificate"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <Share2 size={20} />
                  Share Achievement
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw size={20} />
                Try Again
              </motion.button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExit}
                className="py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl"
              >
                Next Module
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
