import React, { useMemo } from "react";
import { motion } from "framer-motion";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export default function TowerScene({
  totalLevels,
  climbedLevels,
  stage,
  shake,
  levelUpFx,
  hitFx,
  gameStatus,
}) {
  const levels = Math.max(8, totalLevels || 8);
  const climbed = clamp(climbedLevels || 0, 0, levels);
  const playerBottom = clamp((climbed / levels) * 84 + 6, 6, 92);
  const nextGateLevel = clamp(climbed + 1, 1, levels);
  const cameraYOffset = clamp((playerBottom - 44) * 1.6, -28, 28);

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: (i * 17) % 100,
        delay: (i % 7) * 0.25,
        duration: 3 + (i % 5) * 0.5,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className="relative h-full w-full overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#0a1226]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#061428] via-[#18194a] to-[#060a1a]" />

      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{ backgroundPositionY: ["0%", "100%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 12%, rgba(56,189,248,0.18), transparent 22%), radial-gradient(circle at 80% 14%, rgba(99,102,241,0.2), transparent 26%), linear-gradient(transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          backgroundSize: "100% 100%, 100% 100%, 100% 220px",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(56,189,248,0.45), transparent 30%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.35), transparent 32%), radial-gradient(circle at 50% 85%, rgba(236,72,153,0.25), transparent 28%)",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-56 opacity-45"
        animate={{ x: [0, -36] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,132,199,0.25) 0 12%, transparent 12% 16%, rgba(56,189,248,0.18) 16% 26%, transparent 26% 30%, rgba(16,185,129,0.2) 30% 40%, transparent 40% 44%, rgba(99,102,241,0.22) 44% 54%, transparent 54% 58%, rgba(217,70,239,0.2) 58% 68%, transparent 68% 72%, rgba(2,132,199,0.25) 72% 84%, transparent 84% 88%, rgba(56,189,248,0.18) 88% 100%)",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 opacity-55"
        animate={{ x: [0, -45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(34,197,94,0.18) 0 8%, transparent 8% 12%, rgba(14,165,233,0.2) 12% 20%, transparent 20% 24%, rgba(217,70,239,0.18) 24% 32%, transparent 32% 36%, rgba(34,197,94,0.18) 36% 44%, transparent 44% 48%, rgba(14,165,233,0.2) 48% 56%, transparent 56% 60%, rgba(217,70,239,0.18) 60% 68%, transparent 68% 72%, rgba(34,197,94,0.18) 72% 80%, transparent 80% 84%, rgba(14,165,233,0.2) 84% 92%, transparent 92% 100%)",
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-300/70"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 0.9, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="absolute left-1/2 top-3 bottom-3 w-[52%] md:w-[42%] -translate-x-1/2 rounded-3xl border border-cyan-200/20 bg-gradient-to-b from-cyan-400/8 via-indigo-500/12 to-fuchsia-500/10 shadow-[inset_0_0_60px_rgba(56,189,248,0.16)]" />
      <div className="absolute left-[26%] top-3 bottom-3 w-[4%] rounded-2xl border border-cyan-100/15 bg-cyan-200/5" />
      <div className="absolute right-[26%] top-3 bottom-3 w-[4%] rounded-2xl border border-cyan-100/15 bg-cyan-200/5" />

      <motion.div
        className="absolute inset-0"
        animate={{ y: -cameraYOffset }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
      >

        {Array.from({ length: levels }).map((_, idx) => {
          const level = idx + 1;
          const y = (level / levels) * 88;
          const unlocked = level <= climbed;
          const isGoal = level === levels;
          const leftOffset = level % 2 === 0 ? "left-[31%]" : "left-[37%]";

          return (
            <div key={level} className="absolute left-0 right-0" style={{ bottom: `${y}%` }}>
              <div className={`absolute ${leftOffset} w-[32%] md:w-[24%]`}>
                <div
                  className={`h-3 rounded-full border ${
                    unlocked
                      ? "border-emerald-200/70 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 shadow-[0_0_12px_rgba(45,212,191,0.45)]"
                      : "border-slate-300/20 bg-slate-400/20"
                  }`}
                />
                <div className="mt-1 h-1.5 rounded-full bg-black/35" />
                {!unlocked && !isGoal && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2">
                    <div className="h-8 w-12 rounded-md border border-fuchsia-200/45 bg-fuchsia-500/20 shadow-[0_0_16px_rgba(217,70,239,0.45)]" />
                  </div>
                )}
                {isGoal && (
                  <motion.div
                    className="absolute -top-14 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <div className="h-11 w-11 rounded-full border border-amber-100/80 bg-gradient-to-br from-amber-200 to-orange-500 shadow-[0_0_26px_rgba(251,191,36,0.82)]" />
                      <div className="absolute inset-0 rounded-full border border-white/50" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}

        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: `${(nextGateLevel / levels) * 88}%` }}
        >
          <motion.div
            animate={levelUpFx ? { scaleX: [1, 0.2, 0], opacity: [1, 1, 0] } : { scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.65 }}
            className="h-11 w-24 rounded-md border border-fuchsia-200/50 bg-fuchsia-500/25 backdrop-blur-sm shadow-[0_0_22px_rgba(217,70,239,0.55)]"
          />
        </div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          animate={{ bottom: `${playerBottom}%` }}
          transition={{ type: "spring", stiffness: 190, damping: 18 }}
        >
          <motion.svg
            width="108"
            height="126"
            viewBox="0 0 108 126"
            animate={{
              y: gameStatus === "falling" ? [0, 11, 21] : [0, -6, 0],
              rotate: hitFx ? [0, -14, 8, 0] : [0, -2, 2, 0],
            }}
            transition={{
              duration: hitFx ? 0.45 : 0.85,
              repeat: gameStatus === "falling" ? 0 : Infinity,
            }}
            className="drop-shadow-[0_0_24px_rgba(56,189,248,0.72)]"
          >
            <ellipse cx="54" cy="112" rx="20" ry="7" fill="rgba(34,211,238,0.35)" />
            <circle cx="54" cy="23" r="13" fill="#fde68a" />
            <path d="M39 45 L69 45 L64 73 L44 73 Z" fill="#0ea5e9" />
            <rect x="43" y="73" width="9" height="24" rx="5" fill="#7c3aed" />
            <rect x="57" y="73" width="9" height="24" rx="5" fill="#7c3aed" />
            <rect x="28" y="47" width="11" height="8" rx="4" fill="#67e8f9" />
            <rect x="69" y="47" width="11" height="8" rx="4" fill="#67e8f9" />
            <path d="M47 28 Q54 34 61 28" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="22" r="1.3" fill="#1f2937" />
            <circle cx="58" cy="22" r="1.3" fill="#1f2937" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {levelUpFx && (
        <motion.div
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: [0, 1, 0], scale: [0.25, 1.2, 1.8] }}
          transition={{ duration: 0.9 }}
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-emerald-300/80"
        />
      )}

      {hitFx && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-rose-500/35"
        />
      )}

      <div className="absolute left-4 top-4 rounded-lg border border-cyan-200/30 bg-slate-900/60 px-3 py-2 text-xs text-cyan-100">
        <p>
          Stage {Math.max(1, stage)} / {levels}
        </p>
        <p className="text-emerald-300">Climbed {climbed} levels</p>
      </div>
    </motion.div>
  );
}
