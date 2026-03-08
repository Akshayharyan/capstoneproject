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
  const [bossCharge, setBossCharge] = useState(false);
  const [impact, setImpact] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);

  const bossHpPercent = (boss.currentHp / boss.maxHp) * 100;
  const playerHpPercent = (player.hp / player.maxHp) * 100;

  /* ================= PLAYER ATTACK ================= */

useEffect(() => {

  if (!playerAttack) return;

  setPlayerDash(false);
  setSlashEffect(false);

  const start = setTimeout(() => {

    setPlayerDash(true);

    const slash = setTimeout(() => {
      setSlashEffect(true);
    }, 140);

    const dashEnd = setTimeout(() => {
      setPlayerDash(false);
    }, 420);

    const slashEnd = setTimeout(() => {
      setSlashEffect(false);
    }, 700);

    /* cleanup timers */

    return () => {
      clearTimeout(slash);
      clearTimeout(dashEnd);
      clearTimeout(slashEnd);
    };

  }, 10);

  return () => clearTimeout(start);

}, [playerAttack]);

  /* ================= BOSS HIT ================= */

  useEffect(() => {

    if (!damagePopup || damagePopup.type !== "player") return;

    setBossHit(true);

    const timer = setTimeout(() => {
      setBossHit(false);
    }, 350);

    return () => clearTimeout(timer);

  }, [damagePopup]);

  /* ================= BOSS ATTACK ================= */

  useEffect(() => {

    if (!bossAttackTrigger) return;

    setBossCharge(true);

    const chargeTimer = setTimeout(() => {
      setBossCharge(false);
      setBossProjectile(true);
    }, 300);

    const impactTimer = setTimeout(() => {
      setBossProjectile(false);
      setImpact(true);
      setPlayerHit(true);
    }, 850);

    const resetTimer = setTimeout(() => {
      setImpact(false);
      setPlayerHit(false);
    }, 1150);

    return () => {
      clearTimeout(chargeTimer);
      clearTimeout(impactTimer);
      clearTimeout(resetTimer);
    };

  }, [bossAttackTrigger]);

  return (

    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700">

      {/* ARENA VIDEO BACKGROUND */}

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
        absolute bottom-12 left-16
        flex flex-col items-center
        transition-transform duration-200
        ${playerDash ? "translate-x-44 scale-110 rotate-2" : ""}
        ${playerHit ? "animate-[playerHit_0.3s]" : ""}
        `}
      >

       {/* PLAYER ENERGY */}

<div className="absolute w-24 h-24 bg-blue-400 blur-2xl rounded-full animate-[playerEnergy_3s_infinite]" />

<img
  src="/assets/battle/player.png"
  alt="Player"
  className="h-32 object-contain drop-shadow-xl animate-[idleFloat_3s_ease-in-out_infinite]"
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

        <>
          {/* MAIN SLASH */}
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

          {/* TRAIL SLASH */}
          <div
            className="
            absolute
            top-[44%]
            left-[50%]
            w-72
            h-3
            z-40
            opacity-60
            bg-gradient-to-r
            from-red-800
            via-red-600
            to-transparent
            blur-md
            rotate-12
            animate-[slash_0.7s]
            "
          />
        </>

      )}


{/* BOSS */}

<div
  className={`
  absolute top-16 right-20
  flex flex-col items-center
  transition-transform duration-200
  ${bossHit ? "-translate-x-8 scale-110 brightness-150" : ""}
  ${bossPhase === 2 ? "animate-pulse brightness-125" : ""}
  ${bossPhase === 3 ? "animate-[rage_1s_infinite] brightness-150" : ""}
  ${boss.currentHp === 0 ? "animate-[shake_0.6s_infinite]" : ""}
  `}
>

  {/* BOSS AURA */}
  <div
    className="absolute w-56 h-56 bg-red-500 blur-3xl rounded-full animate-[bossAura_3s_infinite]"
  />

  <img
    src="/assets/battle/boss.png"
    alt="Boss"
    className={`h-48 object-contain drop-shadow-2xl animate-[idleFloat_4s_ease-in-out_infinite]
    ${bossCharge ? "brightness-150 animate-pulse" : ""}`}
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


      {/* BOSS ENERGY BEAM */}

      {bossProjectile && (

        <div
          className="
          absolute
          top-[55%]
          right-[200px]
          w-56
          h-3
          bg-gradient-to-l
          from-green-400
          via-green-300
          to-transparent
          blur-sm
          animate-[projectile_0.7s_linear_forwards]
          z-40
          "
        />

      )}


      {/* IMPACT EXPLOSION */}

      {impact && (

        <div
          className="
          absolute
          bottom-24
          left-[170px]
          w-16
          h-16
          bg-green-400
          rounded-full
          blur-xl
          opacity-70
          animate-ping
          "
        />

      )}


      {/* DAMAGE POPUP */}

      {damagePopup && (

        <div
          className={`
          absolute
          top-28
          right-52
          text-4xl
          font-extrabold
          animate-[damageFloat_1s]
          pointer-events-none
          drop-shadow-xl
          ${
            damagePopup.type === "player"
              ? damagePopup.critical
                ? "text-orange-400 scale-125"
                : "text-yellow-400"
              : "text-red-500"
          }
          `}
        >

          {damagePopup.critical ? "CRIT " : ""}-{damagePopup.value}

        </div>

      )}

    </div>

  );

}