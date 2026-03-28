import React, { useMemo, useState } from "react";
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
  const logicalLevels = Math.max(8, totalLevels || 8);
  // Display 15 levels with massive vertical spacing
  const displayLevels = Math.min(15, logicalLevels);
  const climbedLogical = clamp(climbedLevels || 0, 0, logicalLevels);
  const progressRatio = logicalLevels > 0 ? climbedLogical / logicalLevels : 0;
  const climbedDisplay = progressRatio * displayLevels;
  const verticalRange = 95;
  const baseOffset = 2.5;
  const playerBottom = clamp(baseOffset + progressRatio * verticalRange, baseOffset, baseOffset + verticalRange + 4);
  const nextGateProgress = clamp(progressRatio + 1 / logicalLevels, 0, 1);
  const nextGateBottom = clamp(baseOffset + nextGateProgress * verticalRange, 4, 99);
  const scrollRange = 280 + displayLevels * 35;
  // Auto-scroll: keep player roughly centered vertically, scrolling up as they climb
  const autoScrollOffset = clamp((playerBottom - 45) * 4.5, -220, 220);
  const [manualScrollOffset, setManualScrollOffset] = useState(0);
  // Make camera follow the player more aggressively so climbing scrolls the arena
  const cameraYOffset = clamp((playerBottom - 50) * 3.2, -160, 160);

  const levelMarkers = useMemo(
    () =>
      Array.from({ length: displayLevels }, (_, idx) => ({
        id: idx,
        bottom: baseOffset + ((idx + 1) / displayLevels) * verticalRange,
      })),
    [displayLevels]
  );

  const handleWheelScroll = (event) => {
    event.preventDefault();
    setManualScrollOffset((prev) =>
      clamp(prev + event.deltaY * 0.28, -scrollRange, scrollRange)
    );
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: (i * 19) % 100,
        delay: (i % 7) * 0.25,
        duration: 4 + (i % 4) * 0.6,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      onWheel={handleWheelScroll}
      className="relative h-full w-full overflow-hidden rounded-3xl border border-amber-200/20 bg-[#1a120b]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#302016] via-[#1c120c] to-[#120b08]" />

      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{ backgroundPositionY: ["0%", "100%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 12%, rgba(251,191,36,0.24), transparent 24%), radial-gradient(circle at 84% 14%, rgba(220,38,38,0.2), transparent 28%), linear-gradient(transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          backgroundSize: "100% 100%, 100% 100%, 100% 220px",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 16%, rgba(245,158,11,0.36), transparent 30%), radial-gradient(circle at 82% 20%, rgba(180,83,9,0.28), transparent 34%), radial-gradient(circle at 50% 88%, rgba(148,163,184,0.2), transparent 30%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[34%] opacity-70" style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.55) 100%)",
        clipPath:
          "polygon(0 100%, 16% 68%, 27% 82%, 41% 58%, 54% 74%, 66% 56%, 78% 74%, 92% 52%, 100% 67%, 100% 100%)",
      }} />

      <div className="absolute inset-x-0 bottom-0 h-[26%] opacity-55" style={{
        clipPath: "polygon(0 100%, 12% 76%, 24% 86%, 36% 70%, 50% 90%, 64% 68%, 77% 84%, 91% 66%, 100% 80%, 100% 100%)",
        background: "linear-gradient(180deg, rgba(51,65,85,0.2), rgba(15,23,42,0.72))",
      }} />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-56 opacity-40"
        animate={{ x: [0, -36] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(30,41,59,0) 0%, rgba(30,41,59,0.34) 60%, rgba(15,23,42,0.74) 100%), linear-gradient(90deg, rgba(68,38,26,0.5) 0 16%, transparent 16% 24%, rgba(97,52,35,0.5) 24% 40%, transparent 40% 48%, rgba(68,38,26,0.5) 48% 66%, transparent 66% 74%, rgba(97,52,35,0.5) 74% 90%, transparent 90% 100%)",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 opacity-45"
        animate={{ x: [0, -45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(12,20,31,0) 0%, rgba(12,20,31,0.26) 58%, rgba(8,14,24,0.66) 100%), linear-gradient(90deg, rgba(51,65,85,0.36) 0 10%, transparent 10% 16%, rgba(71,85,105,0.34) 16% 28%, transparent 28% 34%, rgba(51,65,85,0.36) 34% 44%, transparent 44% 50%, rgba(71,85,105,0.34) 50% 62%, transparent 62% 68%, rgba(51,65,85,0.36) 68% 80%, transparent 80% 86%, rgba(71,85,105,0.34) 86% 100%)",
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-amber-200/70"
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

      <div className="absolute left-[20%] top-[34%] h-20 w-6 rounded-md bg-stone-700/60" />
      <div className="absolute right-[20%] top-[34%] h-20 w-6 rounded-md bg-stone-700/60" />
      <motion.div
        className="absolute left-[20.2%] top-[31.5%] h-7 w-5 rounded-full bg-gradient-to-b from-amber-100 to-orange-500"
        animate={{ scale: [1, 1.1, 0.96, 1], opacity: [0.82, 1, 0.86, 0.92] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[20.2%] top-[31.5%] h-7 w-5 rounded-full bg-gradient-to-b from-amber-100 to-orange-500"
        animate={{ scale: [1, 1.06, 0.94, 1], opacity: [0.8, 1, 0.84, 0.9] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute left-1/2 top-3 bottom-3 w-[52%] md:w-[42%] -translate-x-1/2 rounded-3xl border border-amber-100/25 bg-gradient-to-b from-stone-300/8 via-stone-700/16 to-stone-900/20 shadow-[inset_0_0_60px_rgba(120,113,108,0.3)]" />
      <div className="absolute left-[26%] top-3 bottom-3 w-[4%] rounded-2xl border border-stone-200/20 bg-stone-300/10" />
      <div className="absolute right-[26%] top-3 bottom-3 w-[4%] rounded-2xl border border-stone-200/20 bg-stone-300/10" />

      {/* Neon level markers down the tower spine for a more game-like read */}
      <div className="absolute left-[6%] top-5 bottom-5 w-1 rounded-full bg-amber-100/10">
        {levelMarkers.map((marker, idx) => (
          <motion.div
            key={marker.id}
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-50 to-orange-300 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            style={{ bottom: `${marker.bottom}%` }}
            animate={{ scale: climbedDisplay >= idx + 1 ? [1, 1.2, 1] : 1, opacity: climbedDisplay >= idx + 1 ? 1 : 0.45 }}
            transition={{ duration: 0.8, repeat: climbedDisplay >= idx + 1 ? Infinity : 0, repeatType: "mirror" }}
          />
        ))}
      </div>

      <motion.div
        className="absolute inset-0"
        animate={{ y: -(cameraYOffset + manualScrollOffset + autoScrollOffset) }}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
      >

        {Array.from({ length: displayLevels }).map((_, idx) => {
          const level = idx + 1;
          const y = baseOffset + (level / displayLevels) * verticalRange + (level - 1) * 1.8;
          const unlocked = level <= Math.floor(climbedDisplay);
          const isGoal = level === displayLevels;
          const platformPattern = [
            { left: "left-[29%]", width: "w-[36%] md:w-[28%]" },
            { left: "left-[35%]", width: "w-[34%] md:w-[26%]" },
            { left: "left-[32%]", width: "w-[38%] md:w-[29%]" },
            { left: "left-[37%]", width: "w-[33%] md:w-[25%]" },
          ];
          const pattern = platformPattern[idx % platformPattern.length];

          return (
            <div key={level} className="absolute left-0 right-0" style={{ bottom: `${y}%` }}>
              <div className={`absolute ${pattern.left} ${pattern.width}`}>
                <div
                  className={`relative h-7 rounded-lg border ${
                    unlocked
                      ? "border-stone-100/50 bg-gradient-to-b from-stone-200/80 via-stone-400/65 to-stone-800/75 shadow-[0_10px_16px_rgba(20,14,10,0.42)]"
                      : "border-stone-300/25 bg-gradient-to-b from-stone-600/45 to-stone-900/60"
                  }`}
                >
                  <div className="absolute left-0 right-0 top-0 h-1.5 rounded-t-lg bg-white/28" />
                  <div className="absolute left-[16%] top-[38%] h-px w-[26%] rotate-[-6deg] bg-black/35" />
                  <div className="absolute left-[52%] top-[46%] h-px w-[20%] rotate-[7deg] bg-black/35" />
                  <div className="absolute left-[70%] top-[24%] h-px w-[12%] rotate-[-14deg] bg-black/35" />
                  <div className="absolute left-0 right-0 bottom-0 h-2 rounded-b-lg bg-black/32" />
                </div>
                {!unlocked && !isGoal && (
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2">
                    <div className="h-8 w-12 rounded-md border border-slate-200/30 bg-slate-700/45 shadow-[0_0_12px_rgba(100,116,139,0.35)]" />
                    <div className="absolute -left-2 right-0 top-4 h-px w-16 bg-slate-200/40" />
                  </div>
                )}
                {isGoal && (
                  <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 64 64"
                        className="drop-shadow-[0_0_18px_rgba(251,191,36,0.7)]"
                      >
                        <defs>
                          <linearGradient id="trophyBody" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                          <linearGradient id="trophyCup" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fde68a" />
                            <stop offset="100%" stopColor="#fbbf24" />
                          </linearGradient>
                        </defs>
                        <path d="M20 10h24v14c0 7-5.4 12-12 12s-12-5-12-12z" fill="url(#trophyCup)" stroke="#b45309" strokeWidth="2" />
                        <path d="M16 14c-4 0-6 3-6 7 0 5 3 9 9 11l-2 4c-8-3-12-10-12-18 0-6 4-12 11-12h6v4z" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
                        <path d="M48 14c4 0 6 3 6 7 0 5-3 9-9 11l2 4c8-3 12-10 12-18 0-6-4-12-11-12h-6v4z" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
                        <rect x="26" y="34" width="12" height="10" rx="3" fill="url(#trophyBody)" stroke="#b45309" strokeWidth="2" />
                        <rect x="22" y="44" width="20" height="6" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
                        <rect x="18" y="50" width="28" height="6" rx="2" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}

        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: `${nextGateBottom}%` }}
        >
          <motion.div
            animate={levelUpFx ? { scaleX: [1, 0.2, 0], opacity: [1, 1, 0] } : { scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.65 }}
            className="h-11 w-24 rounded-md border border-amber-100/45 bg-gradient-to-b from-amber-700/55 to-amber-900/55 backdrop-blur-sm shadow-[0_0_16px_rgba(120,53,15,0.45)]"
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
            className="drop-shadow-[0_0_16px_rgba(251,191,36,0.5)]"
          >
            <ellipse cx="54" cy="112" rx="20" ry="7" fill="rgba(120,113,108,0.4)" />
            {/* Head */}
            <circle cx="54" cy="22" r="12" fill="#f4a76d" />
            {/* Hair */}
            <path d="M54 10 C44 12 38 16 38 24 C38 26 40 28 42 28 L66 28 C68 28 70 26 70 24 C70 16 64 12 54 10 Z" fill="#3d2817" />
            {/* Eyes */}
            <circle cx="50" cy="20" r="1.5" fill="#1f1f1f" />
            <circle cx="58" cy="20" r="1.5" fill="#1f1f1f" />
            {/* Mouth */}
            <path d="M52 26 Q54 27 56 26" stroke="#d4956f" strokeWidth="1" fill="none" />
            {/* Body - Blue Shirt */}
            <path d="M43 32 L65 32 L68 72 L40 72 Z" fill="#3b82f6" />
            {/* Arms */}
            <rect x="36" y="36" width="8" height="28" rx="4" fill="#f4a76d" />
            <rect x="64" y="36" width="8" height="28" rx="4" fill="#f4a76d" />
            {/* Pants */}
            <rect x="43" y="72" width="10" height="22" rx="3" fill="#5a4a3a" />
            <rect x="55" y="72" width="10" height="22" rx="3" fill="#5a4a3a" />
            {/* Shoes */}
            <rect x="42" y="94" width="11" height="8" rx="2" fill="#1f1f1f" />
            <rect x="55" y="94" width="11" height="8" rx="2" fill="#1f1f1f" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {levelUpFx && (
        <motion.div
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: [0, 1, 0], scale: [0.25, 1.2, 1.8] }}
          transition={{ duration: 0.9 }}
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300/80"
        />
      )}

      {hitFx && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-red-700/30"
        />
      )}

      <div className="absolute left-4 top-4 rounded-lg border border-amber-200/30 bg-stone-900/65 px-3 py-2 text-xs text-amber-100">
        <p>
          Stage {Math.max(1, stage)} / {logicalLevels}
        </p>
        <p className="text-amber-300">Climbed {Math.floor(climbedLogical)} levels</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-amber-100/75">
          Scroll wheel to pan tower
        </p>
      </div>
    </motion.div>
  );
}
