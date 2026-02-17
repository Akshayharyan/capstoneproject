import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BossBattlePage() {
  const { token } = useAuth();
  const { moduleId } = useParams();

  const [fight, setFight] = useState(null);
  const [boss, setBoss] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= START FIGHT ================= */
  const startFight = async () => {
    const bossesRes = await fetch("http://localhost:5000/api/bosses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const bosses = await bossesRes.json();
    const selectedBoss = bosses[0];

    const res = await fetch("http://localhost:5000/api/boss/start-boss", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        moduleId,
        bossId: selectedBoss._id,
      }),
    });

    const data = await res.json();

    setBoss(selectedBoss);
    setFight(data);
    setLoading(false);
  };

  /* ================= LOAD CHALLENGE ================= */
  const loadChallenge = async () => {
    const res = await fetch(
      "http://localhost:5000/api/boss/generate-challenge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleId }),
      }
    );

    const data = await res.json();
    setChallenge(data);
    setAnswer("");
  };

  /* ================= ATTACK ================= */
  const attackBoss = async () => {
    setMessage("");

    const res = await fetch("http://localhost:5000/api/boss/attack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        moduleId,
        topicIndex: challenge.topicIndex,
        taskIndex: challenge.taskIndex,
        answer,
      }),
    });

    const data = await res.json();

    if (data.correct) {
      setFight(data.fight);
      setMessage(`🔥 Hit! -${data.damage} HP`);
      loadChallenge();
    } else {
      setMessage("❌ Wrong answer! Boss resisted.");
    }
  };

  useEffect(() => {
    startFight();
    loadChallenge();
    // eslint-disable-next-line
  }, []);

  if (loading || !challenge)
    return (
      <p className="p-10 text-gray-700 font-semibold">
        Loading battle...
      </p>
    );

  if (fight.defeated)
    return (
      <h1 className="text-4xl text-green-600 font-extrabold p-10">
        🏆 Boss Defeated!
      </h1>
    );

  const bossPercent = (fight.currentHp / fight.maxHp) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">

      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        {boss.name}
      </h1>

      <img
        src={boss.image}
        alt="boss"
        className="w-64 rounded-xl shadow-lg mb-6"
      />

      {/* BOSS HP */}
      <div className="w-80 bg-red-200 rounded-full h-5 mb-2 overflow-hidden">
        <div
          className="bg-red-600 h-full transition-all duration-300"
          style={{ width: `${bossPercent}%` }}
        />
      </div>

      <p className="text-gray-800 font-semibold">
        HP: {fight.currentHp}/{fight.maxHp}
      </p>

      {/* ================= CHALLENGE ================= */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg mt-8">

        {challenge.type === "quiz" && (
          <>
            <p className="font-semibold mb-3 text-gray-900">
              {challenge.question}
            </p>
            {challenge.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`block w-full p-2 mb-2 rounded border text-gray-800 ${
                  answer === opt
                    ? "bg-purple-200 border-purple-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </>
        )}

        {challenge.type === "coding" && (
          <>
            <p className="font-semibold mb-2 text-gray-900">
              {challenge.codingPrompt}
            </p>
            <textarea
              className="w-full p-2 border rounded h-32 text-gray-900"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write code here..."
            />
          </>
        )}

        {challenge.type === "bugfix" && (
          <>
            <p className="font-semibold mb-2 text-gray-900">
              Fix this bug:
            </p>
            <pre className="bg-gray-100 p-2 rounded mb-2 text-gray-900">
              {challenge.buggyCode}
            </pre>
            <textarea
              className="w-full p-2 border rounded h-28 text-gray-900"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Correct code..."
            />
          </>
        )}

      </div>

      <button
        onClick={attackBoss}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl mt-6 font-bold transition"
      >
        ⚔ Attack Boss
      </button>

      {message && (
        <p className="mt-4 font-semibold text-gray-900">
          {message}
        </p>
      )}
    </div>
  );
}

export default BossBattlePage;
