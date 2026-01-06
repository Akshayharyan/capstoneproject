import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TopicContentPage = () => {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token, setUser } = useAuth();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TASK STATE
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [codingResults, setCodingResults] = useState({});

  /* ================= FETCH TOPIC ================= */
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/modules/${moduleId}/topics/${topicIndex}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load topic");

        setTopic(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [moduleId, topicIndex, token]);

  /* ================= CODING AUTO CHECK ================= */
  const autoCheckCoding = (task, answer) => {
    if (!task.testCases || task.testCases.length === 0) {
      return { passed: true, message: "✅ Submitted" };
    }

    if (!answer || answer.trim().length < 10) {
      return { passed: false, message: "❌ Code too short" };
    }

    return { passed: true, message: "✅ Looks good!" };
  };

  /* ================= NEXT TASK ================= */
  const nextTask = () => {
    const task = topic.tasks[currentTaskIndex];

    if (task.type === "quiz") {
      const ans = quizAnswers[currentTaskIndex];
      if (!ans || ans !== task.correctAnswer) {
        alert("Please select the correct answer.");
        return;
      }
    }

    setCurrentTaskIndex((i) => i + 1);
  };

  /* ================= COMPLETE TOPIC ================= */
  const completeTopic = async () => {
    const task = topic.tasks[currentTaskIndex];

    if (task.type === "coding") {
      const result = autoCheckCoding(task, codingAnswers[currentTaskIndex]);
      setCodingResults({ [currentTaskIndex]: result });
      if (!result.passed) return;
    }

    alert(`🎉 Topic completed! +${topic.xp} XP`);

    // Refresh dashboard user (optional but recommended)
    const dash = await fetch("http://localhost:5000/api/dashboard/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (dash.ok) {
      const data = await dash.json();
      setUser(data.user);
    }

    navigate(`/modules/${moduleId}/topics`);
  };

  /* ================= UI STATES ================= */
  if (loading)
    return <p className="text-white text-center mt-20">Loading…</p>;
  if (error)
    return <p className="text-red-400 text-center mt-20">{error}</p>;
  if (!topic) return null;

  const task = topic.tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === topic.tasks.length - 1;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
      <p className="text-purple-400 mb-6">🎯 Reward: {topic.xp} XP</p>

      {/* VIDEO */}
      <div className="mb-10">
        <iframe
          className="w-full h-[420px] rounded-xl shadow-xl"
          src={topic.videoUrl}
          title="Learning Video"
          allowFullScreen
        />
      </div>

      {/* TASKS */}
      {topic.tasks.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 max-w-3xl">
          <h3 className="text-purple-300 font-semibold mb-4">
            🧪 Task {currentTaskIndex + 1} / {topic.tasks.length}
          </h3>

          {/* QUIZ */}
          {task.type === "quiz" && (
            <>
              <p className="mb-4 text-lg">{task.question}</p>
              {task.options.map((opt, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setQuizAnswers({ ...quizAnswers, [currentTaskIndex]: opt })
                  }
                  className={`p-3 mb-2 rounded cursor-pointer transition
                    ${
                      quizAnswers[currentTaskIndex] === opt
                        ? "bg-purple-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }
                  `}
                >
                  {opt}
                </div>
              ))}
            </>
          )}

          {/* CODING */}
          {task.type === "coding" && (
            <>
              <p className="mb-3">{task.codingPrompt}</p>
              <textarea
                className="w-full h-40 p-3 bg-gray-800 rounded font-mono"
                value={codingAnswers[currentTaskIndex] || ""}
                onChange={(e) =>
                  setCodingAnswers({
                    ...codingAnswers,
                    [currentTaskIndex]: e.target.value,
                  })
                }
              />

              {codingResults[currentTaskIndex] && (
                <p
                  className={`mt-3 ${
                    codingResults[currentTaskIndex].passed
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {codingResults[currentTaskIndex].message}
                </p>
              )}
            </>
          )}

          {/* ACTION */}
          <button
            onClick={isLastTask ? completeTopic : nextTask}
            className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all
              ${
                isLastTask
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }
            `}
          >
            {isLastTask ? "🏁 Complete Topic" : "Next Task"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicContentPage;
