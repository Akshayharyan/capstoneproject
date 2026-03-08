import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BossIntro from "../../battle/BossIntro";
import BattleArena from "../../battle/BattleArena";
import { bossAbility } from "../../battle/BossAI";

export default function BossBattleArena() {

  const navigate = useNavigate();
  const { moduleId } = useParams();

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
  const [defeat, setDefeat] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [screenFlash, setScreenFlash] = useState(false);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [bossAttackTrigger, setBossAttackTrigger] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);

  const [bossPhase, setBossPhase] = useState(1);
  const [bossDialog, setBossDialog] = useState("");
  const [bossDefeating, setBossDefeating] = useState(false);

  /* ================= MUSIC ================= */

  const [musicOn, setMusicOn] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {

    const audio = new Audio("/assets/audio/boss-theme.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    audioRef.current = audio;

    if (musicOn) {
      audio.play().catch(()=>{});
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };

  }, []);

  useEffect(() => {

    const audio = audioRef.current;
    if (!audio) return;

    if (musicOn) {
      audio.play().catch(()=>{});
    } else {
      audio.pause();
    }

  }, [musicOn]);

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

  const getRandomTaunt = () =>
    bossTaunts[Math.floor(Math.random() * bossTaunts.length)];

  /* ================= INTRO DIALOG ================= */

  useEffect(() => {
    if (!showIntro) {
      setBossDialog("So... another developer challenges me?");
    }
  }, [showIntro]);

  useEffect(() => {

    if (!bossDialog) return;

    const timer = setTimeout(() => {
      setBossDialog("");
    }, 3000);

    return () => clearTimeout(timer);

  }, [bossDialog]);

  /* ================= QUESTION ================= */

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

    } else if (hp <= boss.maxHp * 0.7 && bossPhase !== 2) {

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

    setBossAttackTrigger(false);

    setTimeout(() => {

      setBossAttackTrigger(true);

      setTimeout(() => {

        const newHp = Math.max(player.hp - ability.damage, 0);

        setPlayer(prev => ({
          ...prev,
          hp: newHp
        }));

        if (newHp === 0) {
          setDefeat(true);
        }

        setBattleLog(prev => [
          `${ability.name} hits you for ${ability.damage}`,
          ...prev
        ]);

        setDamagePopup({
          value: ability.damage,
          critical: false,
          type: "boss"
        });

        setTimeout(() => setDamagePopup(null), 900);

      }, 850);

    }, 30);
  };

  /* ================= PLAYER ATTACK ================= */

  const attackBoss = () => {

    if (!selectedAnswer) return;

    if (selectedAnswer === challenge.correct) {

      setPlayerAttack(false);

      setTimeout(() => {

        setPlayerAttack(true);

        setTimeout(() => {
          setScreenFlash(true);
          setShake(true);
        }, 200);

        setTimeout(() => setShake(false), 450);

        setTimeout(() => {
          setScreenFlash(false);
          setPlayerAttack(false);
        }, 650);

      }, 30);

      const damage = Math.floor(Math.random() * 20) + 25;
      const isCritical = Math.random() < 0.25;
      const finalDamage = isCritical ? damage * 2 : damage;

      const newHp = Math.max(boss.currentHp - finalDamage, 0);

      setTimeout(() => {

        setBoss(prev => ({
          ...prev,
          currentHp: newHp
        }));

        if (newHp === 0) {

  setBossDefeating(true);

  setTimeout(() => {
    setVictory(true);
  }, 2000);

}

        setBossDialog("No! How did you solve that challenge?");

        setDamagePopup({
          value: finalDamage,
          critical: isCritical,
          type: "player"
        });

        setTimeout(() => setDamagePopup(null), 1000);

        setBattleLog(prev => [
          `⚔ You dealt ${finalDamage} damage`,
          ...prev
        ]);

        checkPhase(newHp);

      }, 300);

    } else {

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

  /* ================= DEFEAT SCREEN ================= */

  if (defeat) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">

        <h1 className="text-7xl text-red-500 font-bold mb-6">
          💀 YOU WERE DEFEATED
        </h1>

        <p className="text-xl text-gray-400 mb-10">
          The boss proved too powerful...
        </p>

        <div className="flex gap-6">

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700"
          >
            🔁 Retry Battle
          </button>

          <button
  onClick={() => navigate(`/modules/${moduleId}/topics`)}
  className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700"
>
  📚 Back to Topics
</button>

        </div>

      </div>
    );
  }

  /* ================= VICTORY SCREEN ================= */

  if (victory) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">

        <h1 className="text-7xl text-yellow-400 font-bold mb-6 animate-bounce">
          🏆 BOSS DEFEATED
        </h1>

        <p className="text-2xl text-gray-300 mb-4">
          +300 XP Earned
        </p>

        <p className="text-gray-500 mb-10">
          Module Completed
        </p>

        <div className="flex gap-6">

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            🔁 Restart Battle
          </button>

          <button
  onClick={() => navigate(`/modules/${moduleId}/topics`)}
  className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700"
>
  📚 Back to Topics
</button>

        </div>

      </div>
    );
  }

  /* ================= INTRO ================= */

  if (showIntro) {
    return (
      <BossIntro
        bossName={boss.name}
        bossImage="/assets/battle/boss.png"
        bossTitle="Master of Asynchronous Chaos"
        color="red"
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

      <button
        onClick={() => setMusicOn(prev => !prev)}
        className="absolute top-4 right-4 z-50 bg-black/60 p-3 rounded-full text-xl hover:scale-110 hover:bg-purple-700 transition"
      >
        {musicOn ? "🔊" : "🔇"}
      </button>

      {screenFlash && (
        <div className="absolute inset-0 bg-white opacity-20 animate-ping" />
      )}
      {bossDefeating && (

  <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">

    <div className="text-yellow-400 text-6xl font-bold animate-bounce">
      +300 XP
    </div>

  </div>

)}
      

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

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

        <div className="bg-gray-900 border border-purple-700 rounded-2xl p-8">

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