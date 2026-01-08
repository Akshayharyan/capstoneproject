import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Play, CheckCircle, Code } from "lucide-react";

export default function TopicChallengesPage() {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();


  const [topic, setTopic] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH TOPIC ================= */
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/modules/${moduleId}/topics/${topicIndex}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load topic");

        setTopic({
          ...data,
          tasks: Array.isArray(data.tasks) ? data.tasks : [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [moduleId, topicIndex, token]);

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <p className="text-center mt-32 text-gray-500 animate-pulse">
        Loading challenges…
      </p>
    );
  }

  if (!topic) {
    return (
      <p className="text-center mt-32 text-red-500">
        Failed to load topic.
      </p>
    );
  }

  /* ================= TASK SPLIT ================= */
  const tasks = topic.tasks || [];
  const quizTasks = tasks.filter((t) => t.type === "quiz");
  const codingTasks = tasks.filter((t) => t.type === "coding");

  /* ================= QUIZ SUBMIT ================= */
  const submitQuiz = () => {
    if (quizTasks.length === 0) {
      setQuizCompleted(true);
      return;
    }

    if (Object.keys(quizAnswers).length !== quizTasks.length) {
      alert("⚠️ Please answer all quiz questions.");
      return;
    }

    const correct = quizTasks.every(
      (q, i) => quizAnswers[i] === q.correctAnswer
    );

    if (!correct) {
      alert("❌ Some answers are incorrect. Try again.");
      return;
    }

    setQuizCompleted(true);
  };

  /* ================= COMPLETE TOPIC (BACKEND) ================= */
  const completeTopic = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        "http://localhost:5000/api/modules/complete-topic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            moduleId,
            topicIndex: Number(topicIndex),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete topic");

     // ✅ SUCCESS → show XP + refresh user + go back
alert(`🎉 Topic completed!\nYou earned ${data.earnedXP} XP`);

if (typeof refreshUser === "function") {
  await refreshUser(); // 🔥 sync updated XP immediately
}

navigate(`/modules/${moduleId}/topics`);
} catch (err) {
  console.error(err);
  alert("❌ Failed to save progress. Please try again.");
} finally {
  setSaving(false);
}
};

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold mb-4">
            <Play className="w-4 h-4" />
            Challenges
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {topic.title}
          </h1>

          <p className="text-gray-600">
            Complete the quiz to unlock the coding challenge 🚀
          </p>
        </div>

        {/* ================= QUIZ ================= */}
        <section className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🧪 Quiz
          </h2>

          {quizTasks.length === 0 && (
            <p className="text-gray-500">No quiz for this topic.</p>
          )}

          {quizTasks.map((q, qi) => (
            <div key={qi} className="mb-8">
              <p className="font-semibold text-gray-900 mb-3">
                {qi + 1}. {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition
                      ${
                        quizAnswers[qi] === opt
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      value={opt}
                      disabled={quizCompleted}
                      onChange={() =>
                        setQuizAnswers({ ...quizAnswers, [qi]: opt })
                      }
                    />
                    <span className="text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!quizCompleted && (
            <button
              onClick={submitQuiz}
              className="mt-6 px-10 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Submit Quiz
            </button>
          )}

          {quizCompleted && (
            <p className="mt-6 text-green-600 font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quiz completed. Coding unlocked.
            </p>
          )}
        </section>

        {/* ================= CODING ================= */}
        <section
          className={`bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl transition
            ${quizCompleted ? "" : "opacity-50 pointer-events-none"}
          `}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Coding Challenge
            {!quizCompleted && <Lock className="w-5 h-5 text-gray-400" />}
          </h2>

          {codingTasks.length === 0 && (
            <p className="text-gray-500">No coding challenge for this topic.</p>
          )}

          {codingTasks.map((c, i) => (
            <div key={i} className="mb-8">
              <p className="mb-3 text-gray-800 font-medium">
                {c.codingPrompt}
              </p>
              <textarea
                className="w-full h-44 bg-white border border-gray-300 p-4 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Write your code here…"
              />
            </div>
          ))}

          {quizCompleted && (
            <button
              onClick={completeTopic}
              disabled={saving}
              className="mt-6 px-10 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit & Complete Topic"}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
