import React, { useEffect, useState } from "react";

export default function BossIntro({
  bossName,
  bossImage,
  bossTitle,
  color = "red",
  onFinish
}) {

  const [showBoss, setShowBoss] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {

    /* show boss image */
    const bossTimer = setTimeout(() => {
      setShowBoss(true);
    }, 600);

    /* show title */
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1200);

    /* start battle */
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => {
      clearTimeout(bossTimer);
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };

  }, [onFinish]);

  return (

    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* SCREEN FADE */}

      <div className="absolute inset-0 bg-black animate-[fadeIn_1.2s]" />

      {/* BOSS GLOW */}

      <div
        className={`
        absolute
        w-[500px]
        h-[500px]
        blur-[200px]
        opacity-30
        animate-pulse
        bg-${color}-600
        `}
      />

      {/* BOSS IMAGE */}

      {showBoss && (

        <img
          src={bossImage}
          alt="boss"
          className="
          h-72
          relative
          z-10
          animate-[bossReveal_1.5s]
          drop-shadow-[0_0_40px_rgba(255,0,0,0.6)]
          "
        />

      )}

      {/* BOSS TITLE */}

      {showText && (

        <div className="absolute bottom-24 text-center z-20">

          <h1
            className={`
            text-6xl
            font-extrabold
            tracking-widest
            text-${color}-500
            animate-[bossTitleReveal_1.4s]
            drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]
            `}
          >
            {bossName.toUpperCase()}
          </h1>

          {bossTitle && (

            <p
              className="
              text-gray-300
              text-xl
              mt-4
              italic
              tracking-wide
              animate-[bossSubtitle_1.5s]
              "
            >
              {bossTitle}
            </p>

          )}

        </div>

      )}

    </div>

  );

}