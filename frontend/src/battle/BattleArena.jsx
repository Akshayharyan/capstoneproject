import React, { useState, useEffect } from "react";

export default function BattleArena({
  boss,
  player,
  damagePopup,
  playerAttack,
  bossAttackTrigger,
  bossPhase
}) {

  const [bossHit, setBossHit] = useState(false);
  const [playerDash, setPlayerDash] = useState(false);
  const [slashEffect, setSlashEffect] = useState(false);
  const [bossProjectile, setBossProjectile] = useState(false);

  const bossHpPercent = (boss.currentHp / boss.maxHp) * 100;
  const playerHpPercent = (player.hp / player.maxHp) * 100;

  /* ================= PLAYER ATTACK ================= */

  useEffect(() => {

    if (playerAttack) {

      setPlayerDash(true);

      setTimeout(() => {
        setSlashEffect(true);
      }, 150);

      setTimeout(() => {
        setPlayerDash(false);
      }, 450);

      setTimeout(() => {
        setSlashEffect(false);
      }, 750);

    }

  }, [playerAttack]);

  /* ================= BOSS HIT ================= */

  useEffect(() => {

    if (damagePopup) {

      setBossHit(true);

      setTimeout(() => {
        setBossHit(false);
      }, 350);

    }

  }, [damagePopup]);

  /* ================= BOSS PROJECTILE ================= */

  useEffect(() => {

    if (bossAttackTrigger) {

      setBossProjectile(true);

      setTimeout(() => {
        setBossProjectile(false);
      }, 800);

    }

  }, [bossAttackTrigger]);

  return (

    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700">

      {/* ARENA BACKGROUND VIDEO */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/battle/arena-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40"></div>


      {/* PLAYER */}

      <div
        className={`
        absolute
        bottom-12
        left-16
        flex
        flex-col
        items-center
        transition-transform
        duration-300
        ${playerDash ? "translate-x-44 scale-110 rotate-2" : ""}
        `}
      >

        <img
          src="/assets/battle/player.png"
          alt="Player"
          className="h-32 object-contain drop-shadow-xl"
        />

        {/* PLAYER HP */}

        <div className="bg-black/70 px-4 py-2 rounded-lg mt-2 w-40">

          <p className="text-blue-400 font-semibold text-sm">
            Employee
          </p>

          <div className="bg-gray-700 rounded-full h-2 mt-1">

            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${playerHpPercent}%` }}
            />

          </div>

        </div>

      </div>


      {/* PLAYER SLASH */}

      {slashEffect && (

        <div
          className="
          absolute
          top-[43%]
          left-[53%]
          w-72
          h-3
          z-50
          bg-gradient-to-r
          from-red-900
          via-red-700
          to-transparent
          blur-sm
          rotate-12
          animate-[slash_0.7s]
          "
        />

      )}


      {/* BOSS */}

      <div
        className={`
        absolute
        top-16
        right-20
        flex
        flex-col
        items-center
        transition-transform
        duration-200
        ${bossHit ? "-translate-x-8 scale-110 brightness-150" : ""}
        ${bossPhase === 2 ? "animate-pulse brightness-125" : ""}
        ${bossPhase === 3 ? "animate-[rage_1s_infinite] brightness-150" : ""}
        `}
      >

        <img
          src="/assets/battle/boss.png"
          alt="Boss"
          className="h-48 object-contain drop-shadow-2xl"
        />

        {/* BOSS HP */}

        <div className="bg-black/70 px-4 py-2 rounded-lg mt-2 w-44 text-center">

          <p className="text-red-400 font-semibold text-sm">
            {boss.name}
          </p>

          <div className="bg-gray-700 rounded-full h-2 mt-1">

            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${bossHpPercent}%` }}
            />

          </div>

        </div>

      </div>


      {/* BOSS PROJECTILE */}

      {bossProjectile && (

        <div
          className="
          absolute
          top-[55%]
          right-[180px]
          text-green-400
          text-3xl
          animate-[projectile_0.8s_linear_forwards]
          drop-shadow-lg
          "
        >
          💻
        </div>

      )}


      {/* DAMAGE POPUP */}

      {damagePopup && (

        <div
          className="
          absolute
          top-28
          right-52
          text-yellow-400
          text-3xl
          font-bold
          animate-bounce
          drop-shadow-xl
          "
        >

          {damagePopup}

        </div>

      )}

    </div>

  );

}