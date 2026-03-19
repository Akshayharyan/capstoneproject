import React, { useState, useEffect, useRef } from "react";

export default function BattleArena({
  boss,
  player,
  damagePopup,
  playerAttack,
  bossAttackTrigger,
  bossPhase
}) {

  const [bossHit, setBossHit] = useState(false);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [bossCharging, setBossCharging] = useState(false);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [screenFlash, setScreenFlash] = useState(null);
  const [projectile, setProjectile] = useState(null);
  const [playerHit, setPlayerHit] = useState(false);
  const [bossImpactPoint, setBossImpactPoint] = useState(null);
  const [playerImpactPoint, setPlayerImpactPoint] = useState(null);

  const arenaRef = useRef(null);
  const bossRef = useRef(null);
  const playerRef = useRef(null);

  const getRelativeCenter = (target, container) => {
    if (!target || !container) return null;
    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: targetRect.left - containerRect.left + targetRect.width / 2,
      y: targetRect.top - containerRect.top + targetRect.height / 2
    };
  };

  /* SOUND REFERENCES */

  const slashSound = useRef(null);
  const beamSound = useRef(null);

  const bossHpPercent = (boss.currentHp / boss.maxHp) * 100;
  const playerHpPercent = (player.hp / player.maxHp) * 100;

  const playerAnimClass = [
    playerAttacking ? "animate-playerLunge" : "",
    playerHit ? "animate-elecShock" : ""
  ].filter(Boolean).join(" ");

  const bossAnimClass = [
    bossAttacking ? "animate-bossLunge" : "",
    bossCharging ? "animate-bossCharge" : ""
  ].filter(Boolean).join(" ");

  const bossFlashOrigin = bossImpactPoint
    ? `${bossImpactPoint.x}px ${bossImpactPoint.y}px`
    : "72% 22%";

  const playerFlashOrigin = playerImpactPoint
    ? `${playerImpactPoint.x}px ${playerImpactPoint.y}px`
    : "28% 78%";

  /* ================= LOAD SOUNDS ================= */

  useEffect(() => {

    slashSound.current = new Audio("/assets/audio/slash.mp3");
    slashSound.current.volume = 0.6;

    beamSound.current = new Audio("/assets/audio/beam.mp3");
    beamSound.current.volume = 0.7;

  }, []);

  /* ================= PLAYER ATTACK ================= */

  useEffect(() => {

    if (!playerAttack) return;

    if (slashSound.current) {
      slashSound.current.currentTime = 0;
      slashSound.current.play().catch(() => {});
    }

    const bossPoint = getRelativeCenter(bossRef.current, arenaRef.current);
    const playerPoint = getRelativeCenter(playerRef.current, arenaRef.current);

    if (bossPoint) setBossImpactPoint(bossPoint);
    if (playerPoint) setPlayerImpactPoint(playerPoint);

    setPlayerAttacking(true);
    setProjectile(null);
    setScreenFlash(null);

    const slashTimer = setTimeout(() => {
      setProjectile("player");
    }, 120);

    const flashTimer = setTimeout(() => {
      setScreenFlash("boss");
    }, 420);

    const cleanupTimer = setTimeout(() => {
      setProjectile(null);
      setScreenFlash(null);
      setPlayerAttacking(false);
    }, 750);

    return () => {
      clearTimeout(slashTimer);
      clearTimeout(flashTimer);
      clearTimeout(cleanupTimer);
    };

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

    if (beamSound.current) {
      beamSound.current.currentTime = 0;
      beamSound.current.play().catch(() => {});
    }

    const bossPoint = getRelativeCenter(bossRef.current, arenaRef.current);
    const playerPoint = getRelativeCenter(playerRef.current, arenaRef.current);

    if (bossPoint) setBossImpactPoint(bossPoint);
    if (playerPoint) setPlayerImpactPoint(playerPoint);

    setBossCharging(true);
    setBossAttacking(false);
    setProjectile(null);
    setScreenFlash(null);

    const chargeTimer = setTimeout(() => {
      setBossCharging(false);
      setBossAttacking(true);
      setProjectile("boss");
      setPlayerHit(true);
    }, 320);

    const flashTimer = setTimeout(() => {
      setScreenFlash("player");
    }, 720);

    const cleanupTimer = setTimeout(() => {
      setProjectile(null);
      setBossAttacking(false);
      setScreenFlash(null);
      setPlayerHit(false);
    }, 1150);

    return () => {
      clearTimeout(chargeTimer);
      clearTimeout(flashTimer);
      clearTimeout(cleanupTimer);
    };

  }, [bossAttackTrigger]);

  return (

    <div ref={arenaRef} className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700">

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
        ${playerAnimClass}
        `}
        ref={playerRef}
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

      {/* PLAYER SLASH FX */}

      {projectile === "player" && bossImpactPoint && (

        <>
          <div
            className="absolute z-50 pointer-events-none animate-slashSwipe"
            style={{
              top: bossImpactPoint.y - 130,
              left: bossImpactPoint.x - 130,
              width: 260,
              height: 260
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "10%",
                width: "80%",
                height: 6,
                background:
                  "linear-gradient(90deg,transparent,rgba(0,255,220,.95) 20%,rgba(255,255,255,.95) 50%,rgba(0,255,220,.95) 80%,transparent)",
                transform: "rotate(-35deg)",
                borderRadius: 4,
                boxShadow:
                  "0 0 18px rgba(0,255,200,.8), 0 0 40px rgba(0,255,200,.4)"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "45%",
                left: "5%",
                width: "90%",
                height: 5,
                background:
                  "linear-gradient(90deg,transparent,rgba(0,220,255,.9) 25%,rgba(255,255,255,.9) 50%,rgba(0,220,255,.9) 75%,transparent)",
                transform: "rotate(-35deg)",
                borderRadius: 4,
                boxShadow: "0 0 14px rgba(0,220,255,.7), 0 0 32px rgba(0,220,255,.3)",
                animationDelay: "40ms"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "68%",
                left: "15%",
                width: "70%",
                height: 4,
                background:
                  "linear-gradient(90deg,transparent,rgba(0,255,200,.85) 30%,rgba(255,255,255,.85) 50%,rgba(0,255,200,.85) 70%,transparent)",
                transform: "rotate(-35deg)",
                borderRadius: 4,
                boxShadow: "0 0 12px rgba(0,255,200,.6)"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "38%",
                left: "42%",
                width: 40,
                height: 40,
                background:
                  "radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(0,255,220,.6) 40%,transparent 70%)",
                filter: "blur(4px)"
              }}
            />
          </div>

          {playerImpactPoint && (
            <div
              className="absolute z-40 pointer-events-none animate-slashTravel"
              style={{
                top: playerImpactPoint.y - 20,
                left: playerImpactPoint.x - 40
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 18,
                  background:
                    "linear-gradient(90deg, rgba(0,255,200,.95), rgba(255,255,255,.8), rgba(0,220,255,.5), transparent)",
                  filter: "blur(3px)",
                  borderRadius: 18,
                  boxShadow: "0 0 20px rgba(0,255,200,.6)"
                }}
              />
            </div>
          )}

        </>

      )}

      {/* BOSS */}

      <div
        className={`
        absolute top-16 right-20
        flex flex-col items-center
        transition-transform duration-200
        ${bossAnimClass}
        ${bossHit ? " -translate-x-8 scale-110 brightness-150" : ""}
        ${bossPhase === 2 ? " animate-pulse brightness-125" : ""}
        ${bossPhase === 3 ? " animate-[rage_1s_infinite] brightness-150" : ""}
        ${boss.currentHp === 0 ? " animate-[shake_0.6s_infinite]" : ""}
        `}
        ref={bossRef}
      >

        <div className="absolute w-56 h-56 bg-red-500 blur-3xl rounded-full animate-[bossAura_3s_infinite]" />

        <img
          src="/assets/battle/boss.png"
          alt="Boss"
          className={`h-48 object-contain drop-shadow-2xl animate-[idleFloat_4s_ease-in-out_infinite]
          ${bossCharging ? "brightness-150 animate-pulse" : ""}`}
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

      {/* BOSS CHARGE FX */}

      {bossCharging && bossImpactPoint && (
        <>
          <div
            className="absolute inset-0 z-25 pointer-events-none animate-screenDarken"
            style={{ background: "rgba(0,0,0,.35)" }}
          />
          <div
            className="absolute z-35 pointer-events-none"
            style={{
              top: bossImpactPoint.y - 100,
              left: bossImpactPoint.x - 100,
              width: 200,
              height: 200
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "3px solid rgba(255,60,60,.6)",
                animation: "bossChargeRing 500ms ease-out forwards"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(255,180,60,.5)",
                animation: "bossChargeRing 500ms 100ms ease-out forwards"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,100,.4)",
                animation: "bossChargeRing 500ms 200ms ease-out forwards"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "35%",
                width: "30%",
                height: "30%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(255,255,200,.9) 0%,rgba(255,80,40,.7) 50%,transparent 70%)",
                filter: "blur(6px)",
                animation: "cyberPulse .3s ease-in-out infinite"
              }}
            />
          </div>
        </>
      )}

      {/* BOSS THUNDER STRIKE */}

      {projectile === "boss" && playerImpactPoint && (
        <>
          <div
            className="absolute inset-0 z-25 pointer-events-none animate-screenDarken"
            style={{ background: "rgba(0,0,10,.4)" }}
          />

              <div
                className="absolute z-30 pointer-events-none animate-thunderBolt"
                style={{
                  top: playerImpactPoint.y - 360,
                  left: playerImpactPoint.x - 90,
                  width: 180,
                  height: 400
                }}
              >
                <svg viewBox="0 0 180 400" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                  <polygon points="85,0 95,0 125,80 100,85 145,175 112,180 155,290 110,295 135,400 75,400 100,295 60,290 90,180 48,175 80,85 55,80"
                    fill="url(#boltGradMain)" stroke="#fff" strokeWidth="2.5" />
                  <polygon points="88,8 93,8 118,82 98,86 135,176 108,180 142,286 106,291 125,392 82,392 102,291 66,286 92,180 56,176 82,86 62,82"
                    fill="rgba(255,255,240,.9)" />
                  <defs>
                    <linearGradient id="boltGradMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffc0" />
                      <stop offset="35%" stopColor="#ffe040" />
                      <stop offset="100%" stopColor="#f0a800" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div
                className="absolute z-30 pointer-events-none animate-thunderFlicker"
                style={{
                  top: playerImpactPoint.y - 360,
                  left: playerImpactPoint.x - 130,
                  width: 90,
                  height: 400,
                  opacity: 0.75
                }}
              >
                <svg viewBox="0 0 90 400" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                  <polygon points="42,0 50,0 68,100 54,105 76,220 58,225 78,400 36,400 56,225 38,220 54,105 36,100"
                    fill="#ffe840" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>

              <div
                className="absolute z-30 pointer-events-none animate-thunderFlicker"
                style={{
                  top: playerImpactPoint.y - 360,
                  left: playerImpactPoint.x - 20,
                  width: 70,
                  height: 400,
                  opacity: 0.55,
                  animationDelay: "80ms"
                }}
              >
                <svg viewBox="0 0 70 400" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                  <polygon points="32,0 40,0 55,120 44,125 62,260 50,265 60,400 28,400 42,265 30,260 44,125 30,120"
                    fill="#ffd420" stroke="#fff8" strokeWidth="1" />
                </svg>
              </div>

              <div
                className="absolute z-30 pointer-events-none animate-elecArc"
                style={{
                  top: playerImpactPoint.y - 20,
                  left: playerImpactPoint.x - 210,
                  width: 420,
                  height: 100
                }}
              >
                <svg viewBox="0 0 420 100" style={{ width: "100%", height: "100%" }}>
                  <polyline points="0,50 25,20 55,65 85,10 115,55 140,18 175,70 205,15 235,55 265,25 295,65 325,15 355,50 385,28 420,50"
                    fill="none" stroke="#ffe840" strokeWidth="5" strokeLinejoin="round" />
                  <polyline points="10,60 40,30 70,72 100,22 130,62 160,30 190,75 220,18 250,58 280,32 310,68 340,22 370,55 400,35"
                    fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2.5" strokeLinejoin="round" />
                  <polyline points="5,45 35,70 65,25 95,60 125,15 155,55 185,28 215,65 245,20 275,55 305,30 335,62 365,20 395,55"
                    fill="none" stroke="rgba(255,200,0,.5)" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              </div>

              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * 360;
                const dist = 40 + Math.random() * 60;
                const sx = Math.cos(angle * Math.PI / 180) * dist;
                const sy = Math.sin(angle * Math.PI / 180) * dist;
                return (
                  <div
                    key={`spark-${i}`}
                    className="absolute z-35 pointer-events-none"
                    style={{
                      top: playerImpactPoint.y - 40,
                      left: playerImpactPoint.x - 20,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#ffe840",
                      boxShadow: "0 0 8px #ffe840, 0 0 16px rgba(255,200,0,.6)",
                      "--sx": `${sx}px`,
                      "--sy": `${sy}px`,
                      animation: `elecSpark 500ms ${80 + i * 30}ms ease-out forwards`
                    }}
                  />
                );
              })}

              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  top: playerImpactPoint.y + 10,
                  left: playerImpactPoint.x - 190,
                  width: 380,
                  height: 30
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg,transparent,rgba(255,232,64,.6) 30%,rgba(255,255,200,.8) 50%,rgba(255,232,64,.6) 70%,transparent)",
                    borderRadius: "50%",
                    filter: "blur(4px)",
                    animation: "groundPulse 500ms ease-out forwards"
                  }}
                />
              </div>

              <div
                className="absolute z-30 pointer-events-none animate-elecGlow"
                style={{
                  top: playerImpactPoint.y - 120,
                  left: playerImpactPoint.x - 180,
                  width: 360,
                  height: 240
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "radial-gradient(ellipse at 50% 65%, rgba(255,255,200,.6) 0%, rgba(255,232,64,.35) 30%, rgba(255,180,0,.15) 55%, transparent 75%)",
                    filter: "blur(16px)"
                  }}
                />
              </div>

            </>
          )}

          {/* SCREEN FLASH */}

          {screenFlash && (
            <div
              className="absolute inset-0 z-40 pointer-events-none animate-impactFlash"
              style={{
                background:
                  screenFlash === "boss"
                    ? `radial-gradient(circle at ${bossFlashOrigin}, rgba(0,255,200,.45), transparent 55%)`
                    : `radial-gradient(circle at ${playerFlashOrigin}, rgba(255,232,64,.55), transparent 50%)`
              }}
            />
          )}
      {/* BOSS */}

      <div
        className={`
        absolute top-16 right-20
        flex flex-col items-center
        transition-transform duration-200
        ${bossAnimClass}
        ${bossHit ? " -translate-x-8 scale-110 brightness-150" : ""}
        ${bossPhase === 2 ? " animate-pulse brightness-125" : ""}
        ${bossPhase === 3 ? " animate-[rage_1s_infinite] brightness-150" : ""}
        ${boss.currentHp === 0 ? " animate-[shake_0.6s_infinite]" : ""}
        `}
        ref={bossRef}
      >

        <div className="absolute w-56 h-56 bg-red-500 blur-3xl rounded-full animate-[bossAura_3s_infinite]" />

        <img
          src="/assets/battle/boss.png"
          alt="Boss"
          className={`h-48 object-contain drop-shadow-2xl animate-[idleFloat_4s_ease-in-out_infinite]
          ${bossCharging ? "brightness-150 animate-pulse" : ""}`}
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