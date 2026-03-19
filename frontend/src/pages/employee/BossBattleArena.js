import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BossIntro from "../../battle/BossIntro";
import BattleArena from "../../battle/BattleArena";
import { bossAbility } from "../../battle/BossAI";

const FALLBACK_CHALLENGE = {
  question: "What does async/await return?",
  options: ["Promise", "Value", "Callback", "Error"],
  correctIndex: 0
};

const normalizeChallenge = (raw = {}) => ({
  question: raw.question || FALLBACK_CHALLENGE.question,
  options:
    Array.isArray(raw.options) && raw.options.length
      ? raw.options
      : FALLBACK_CHALLENGE.options,
  correctIndex:
    typeof raw.correctIndex === "number"
      ? raw.correctIndex
      : FALLBACK_CHALLENGE.correctIndex
});

const randomChallengeFromPool = (pool = []) => {
  if (!Array.isArray(pool) || pool.length === 0) {
    return { ...FALLBACK_CHALLENGE };
  }

  const raw = pool[Math.floor(Math.random() * pool.length)] || {};
  return normalizeChallenge(raw);
};

export default function BossBattleArena() {

  const navigate = useNavigate();
  const { moduleId } = useParams();
  const { token } = useAuth();

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

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [challenge, setChallenge] = useState(FALLBACK_CHALLENGE);
  const [questionLoading, setQuestionLoading] = useState(true);

  const [screenFlash, setScreenFlash] = useState(false);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [bossAttackTrigger, setBossAttackTrigger] = useState(false);

  const [showIntro, setShowIntro] = useState(true);
  const [shake, setShake] = useState(false);

  const [bossPhase, setBossPhase] = useState(1);
  const [bossDialog, setBossDialog] = useState("");
  const [bossDefeating, setBossDefeating] = useState(false);

  const handleIntroFinish = useCallback(() => {
    setShowIntro(false);
  }, []);

  const refreshChallenge = useCallback(() => {
    setChallenge(randomChallengeFromPool(questions));
    setSelectedAnswer(null);
  }, [questions]);

  useEffect(() => {
    if (!token) {
      setQuestionLoading(false);
      setChallenge(randomChallengeFromPool([]));
      setSelectedAnswer(null);
      return;
    }

    const fetchQuestions = async () => {
      setQuestionLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/modules/${moduleId}/quiz-pool`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        const pool = data?.questions || [];
        setQuestions(pool);
        setChallenge(randomChallengeFromPool(pool));
        setSelectedAnswer(null);
      } catch (err) {
        console.error("Failed to load challenge pool", err);
        setChallenge(randomChallengeFromPool([]));
        setSelectedAnswer(null);
      } finally {
        setQuestionLoading(false);
      }
    };

    fetchQuestions();
  }, [moduleId, token]);

  /* ================= MUSIC ================= */

  const [musicOn, setMusicOn] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {

    const audio = new Audio("/assets/audio/boss-theme.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    audioRef.current = audio;

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

    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === challenge.correctIndex;

    if (isCorrect) {

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

    setSelectedAnswer(null);
    refreshChallenge();
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
        onFinish={handleIntroFinish}
      />
    );
  }

  /* ================= MAIN ARENA ================= */

  return (

    <div
      className={`min-h-screen bg-[#03050e] text-slate-100 px-4 sm:px-6 py-8 relative overflow-hidden ${
        shake ? "animate-[shake_0.3s]" : ""
      }`}
    >

      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.4),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-900/70 to-transparent" />

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

      <div className="relative w-full max-w-[1650px] mx-auto space-y-8 z-10">

        <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-fuchsia-900/40 p-1 shadow-[0_40px_140px_rgba(79,70,229,0.35)]">
          <div className="rounded-[34px] bg-black/40 backdrop-blur-xl px-6 py-6 xl:px-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-fuchsia-300">Boss Arena</p>
              <h1 className="text-4xl font-black text-white mt-3">{boss.name}</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                Dominate the stage and answer randomized module challenges to break through Async Overload's shield.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.45em] text-slate-400">Player HP</p>
                <p className="text-2xl font-black text-emerald-300">{player.hp} / {player.maxHp}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.45em] text-slate-400">Boss HP</p>
                <p className="text-2xl font-black text-rose-300">{boss.currentHp} / {boss.maxHp}</p>
              </div>
              <button
                onClick={() => navigate(`/modules/${moduleId}/topics`)}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Exit Arena
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,0.68fr)_minmax(320px,0.32fr)] gap-6 xl:gap-10">

          <div className="relative">
            <div className="relative rounded-[42px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-[#050d1f] to-indigo-950/80 p-4 sm:p-6 shadow-[0_45px_120px_rgba(2,6,23,0.8)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="absolute inset-0 border border-white/5 rounded-[38px] blur-xl" />
              <div className="relative h-[520px] sm:h-[600px] w-full transform-gpu">
                <BattleArena
                  boss={boss}
                  player={player}
                  damagePopup={damagePopup}
                  playerAttack={playerAttack}
                  bossAttackTrigger={bossAttackTrigger}
                  bossPhase={bossPhase}
                />
              </div>
            </div>

            <div className="mt-4 xl:hidden rounded-[28px] border border-white/10 bg-black/60 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Battle log</p>
                <span className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {battleLog.map((log, i) => (
                  <p key={i} className="text-sm text-slate-200/90">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[36px] border border-purple-500/30 bg-gradient-to-b from-purple-900/60 via-[#1b0f2b] to-[#0a0412] p-6 shadow-[0_30px_90px_rgba(109,40,217,0.35)] xl:sticky xl:top-10 self-start">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-fuchsia-300">Boss Intel</p>
                <h3 className="text-2xl font-bold text-white">{boss.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Phase</p>
                <p className="text-lg font-black text-fuchsia-200">#{bossPhase}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-black/40 border border-white/10 p-4 min-h-[72px] text-sm text-slate-300">
              {bossDialog || "..."}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.4em] text-fuchsia-300">Attack Challenge</p>
                {phaseMessage && (
                  <span className="text-xs font-bold text-amber-300 animate-pulse">{phaseMessage}</span>
                )}
              </div>
              {questionLoading ? (
                <div className="py-6 text-center text-slate-400 text-sm">Loading quiz intel...</div>
              ) : (
                <p className="text-lg font-semibold text-white leading-relaxed">
                  {challenge.question}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {(challenge.options || []).map((opt, idx) => (
                <button
                  key={`${opt}-${idx}`}
                  onClick={() => setSelectedAnswer(idx)}
                  disabled={questionLoading}
                  className={`w-full rounded-2xl border px-4 py-3 text-left font-semibold transition flex items-center gap-3 ${
                    selectedAnswer === idx
                      ? "border-fuchsia-400 bg-fuchsia-500/20 text-white shadow-lg"
                      : "border-white/10 bg-black/30 text-slate-200 hover:border-fuchsia-500/40"
                  } ${questionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}

              {!challenge.options?.length && !questionLoading && (
                <p className="text-sm text-slate-400">No quiz questions available for this module yet.</p>
              )}
            </div>

            <button
              onClick={attackBoss}
              disabled={questionLoading || selectedAnswer === null}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 py-3 text-lg font-black uppercase tracking-[0.3em] shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              ⚔ Attack Boss
            </button>
          </div>

        </div>

        <div className="hidden xl:flex gap-6">
          <div className="flex-1 rounded-[28px] border border-white/10 bg-black/60 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Battle log</p>
              <span className="text-xs text-slate-500">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {battleLog.map((log, i) => (
                <p key={i} className="text-sm text-slate-200/90">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>

  );
}