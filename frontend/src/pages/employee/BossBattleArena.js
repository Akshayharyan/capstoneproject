import React, { useState, useEffect } from "react";
import BossIntro from "../../battle/BossIntro";
import BattleArena from "../../battle/BattleArena";
import { bossAbility } from "../../battle/BossAI";

export default function BossBattleArena() {

  const [boss, setBoss] = useState({
    name: "Async Overload",
    maxHp: 300,
    currentHp: 300
  });

  const [player, setPlayer] = useState({
    hp: 120,
    maxHp: 120
  });

  const [battleLog, setBattleLog] = useState([
    "⚔ A legendary boss appears..."
  ]);

  const [damagePopup, setDamagePopup] = useState(null);
  const [phaseMessage, setPhaseMessage] = useState("");
  const [victory, setVictory] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [screenFlash, setScreenFlash] = useState(false);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [bossAttackTrigger, setBossAttackTrigger] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);

  const [bossPhase, setBossPhase] = useState(1);
  const [bossDialog, setBossDialog] = useState("");

  /* ================= BOSS TAUNTS ================= */

  const bossTaunts = [
    "Your code will never compile!",
    "You dare challenge my algorithms?",
    "I will crash your program!",
    "Your logic is flawed, developer!",
    "Prepare for a runtime error!",
    "You cannot escape the debugger!",
    "Your code style is inefficient!",
    "I control the execution stack!"
  ];

  const getRandomTaunt = () => {
    return bossTaunts[Math.floor(Math.random() * bossTaunts.length)];
  };

  /* ================= INITIAL DIALOG ================= */

  useEffect(() => {
    if (!showIntro) {
      setBossDialog("So... another developer challenges me?");
    }
  }, [showIntro]);

  /* ================= AUTO HIDE DIALOG ================= */

  useEffect(() => {

    if (!bossDialog) return;

    const timer = setTimeout(() => {
      setBossDialog("");
    }, 3000);

    return () => clearTimeout(timer);

  }, [bossDialog]);

  const challenge = {
    question: "What does async/await return?",
    options: ["Promise", "Value", "Callback", "Error"],
    correct: "Promise"
  };

  /* ================= PHASE SYSTEM ================= */

  const checkPhase = (hp) => {

    if (hp <= boss.maxHp * 0.3 && bossPhase !== 3) {

      setBossPhase(3);
      setPhaseMessage("💀 FINAL PHASE");
      setBossDialog("Impossible... I will not be defeated!");

    }

    else if (hp <= boss.maxHp * 0.7 && bossPhase !== 2) {

      setBossPhase(2);
      setPhaseMessage("🔥 PHASE 2 - BOSS RAGE");
      setBossDialog("You are stronger than I expected...");

    }

    setTimeout(() => setPhaseMessage(""), 2000);

  };

  /* ================= BOSS ATTACK ================= */

  const bossAttack = () => {

    const ability = bossAbility();

    setBossDialog(getRandomTaunt());

    setBossAttackTrigger(true);

    setTimeout(() => {
      setBossAttackTrigger(false);
    }, 700);

    const newHp = Math.max(player.hp - ability.damage, 0);

    setPlayer(prev => ({
      ...prev,
      hp: newHp
    }));

    setBattleLog(prev => [
      `${ability.name} hits you for ${ability.damage}`,
      ...prev
    ]);

    setDamagePopup(`-${ability.damage}`);

    setTimeout(() => setDamagePopup(null), 900);

  };

  /* ================= PLAYER ATTACK ================= */

  const attackBoss = () => {

    if (!selectedAnswer) return;

    if (selectedAnswer === challenge.correct) {

      /* PLAYER ATTACK */

      setPlayerAttack(true);

      setTimeout(() => {
        setScreenFlash(true);
        setShake(true);
      }, 200);

      setTimeout(() => {
        setShake(false);
      }, 450);

      setTimeout(() => {
        setScreenFlash(false);
        setPlayerAttack(false);
      }, 650);

      const damage = Math.floor(Math.random() * 20) + 25;
      const newHp = Math.max(boss.currentHp - damage, 0);

      setTimeout(() => {

        setBoss(prev => ({
          ...prev,
          currentHp: newHp
        }));

        setBossDialog("No! How did you solve that challenge?");

        setDamagePopup(`🔥 ${damage}`);

        setBattleLog(prev => [
          `⚔ You dealt ${damage} damage`,
          ...prev
        ]);

        checkPhase(newHp);

        if (newHp === 0) {
          setVictory(true);
          return;
        }

      }, 300);

    }

    else {

      /* BOSS ATTACK */

      setTimeout(() => {

        setBossDialog("Wrong answer... your logic fails!");

        setBattleLog(prev => [
          "❌ Wrong answer! Boss punishes you",
          ...prev
        ]);

        bossAttack();

      }, 300);

    }

    setSelectedAnswer("");

  };

  /* ================= VICTORY SCREEN ================= */

  if (victory) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

        <h1 className="text-6xl font-bold text-yellow-400 mb-6 animate-bounce">
          🏆 BOSS DEFEATED
        </h1>

        <p className="text-2xl text-gray-300">
          +300 XP Earned
        </p>

        <p className="mt-4 text-gray-500">
          Module Completed
        </p>

      </div>
    );
  }

  /* ================= BOSS INTRO ================= */

  if (showIntro) {

    return (
      <BossIntro
        bossName={boss.name}
        onFinish={() => setShowIntro(false)}
      />
    );

  }

  /* ================= MAIN ARENA ================= */

  return (

    <div
      className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10 relative
      ${shake ? "animate-[shake_0.3s]" : ""}`}
    >

      {screenFlash && (
        <div className="absolute inset-0 bg-white opacity-20 animate-ping" />
      )}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2 space-y-6">

          <div className="h-[460px]">

            <BattleArena
              boss={boss}
              player={player}
              damagePopup={damagePopup}
              playerAttack={playerAttack}
              bossAttackTrigger={bossAttackTrigger}
              bossPhase={bossPhase}
            />

          </div>

          {/* BATTLE LOG */}

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 h-48 overflow-y-auto">

            <h3 className="text-gray-300 font-semibold mb-2">
              Battle Log
            </h3>

            {battleLog.map((log, i) => (
              <p key={i} className="text-sm text-gray-400">
                {log}
              </p>
            ))}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="bg-gray-900 border border-purple-700 rounded-2xl p-8">

          {/* BOSS DIALOG */}

          <div className="bg-black border border-red-600 rounded-xl p-4 mb-6 shadow-lg min-h-[80px] flex flex-col justify-center">

  <p className="text-red-400 font-bold mb-1">
    {boss.name}
  </p>

  <p className="text-gray-300 text-sm">
    {bossDialog || "..."}
  </p>

</div>
          <h2 className="text-xl font-bold text-purple-400 mb-6">
            🔥 Attack Challenge
          </h2>

          {phaseMessage && (
            <div className="mb-4 text-center text-yellow-400 font-bold animate-pulse">
              {phaseMessage}
            </div>
          )}

          <p className="mb-4 text-gray-300">
            {challenge.question}
          </p>

          <div className="space-y-3">

            {challenge.options.map((opt) => (

              <button
                key={opt}
                onClick={() => setSelectedAnswer(opt)}
                className={`w-full p-3 rounded-lg border transition ${
                  selectedAnswer === opt
                    ? "bg-purple-800 border-purple-400"
                    : "border-gray-700 hover:bg-gray-800"
                }`}
              >
                {opt}
              </button>

            ))}

          </div>

          <button
            onClick={attackBoss}
            className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg transition"
          >
            ⚔ Attack Boss
          </button>

        </div>

      </div>

    </div>

  );

}