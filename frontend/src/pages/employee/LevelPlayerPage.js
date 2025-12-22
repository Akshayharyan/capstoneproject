import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";

const LevelPlayerPage = () => {
  const { moduleId, topicIndex, levelIndex } = useParams();
  const { token, setUser } = useAuth();
  const navigate = useNavigate();

  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GAME STATE
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  // ANSWERS
  const [quizResults, setQuizResults] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [codingResults, setCodingResults] = useState({});

  useEffect(() => {
    fetchLevel();
    // eslint-disable-next-line
  }, [moduleId, topicIndex, levelIndex]);

  // =========================
  // FETCH LEVEL
  // =========================
  const fetchLevel = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels/${levelIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load level");

      setLevel(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO-GRADE CODING
  // =========================
  const autoGradeCoding = (task, answer) => {
    if (!task.expectedPatterns || task.expectedPatterns.length === 0) {
      return { passed: true, message: "Accepted (no rules defined)" };
    }

    const code = answer.toLowerCase();
    const missing = task.expectedPatterns.filter(
      (p) => !code.includes(p.toLowerCase())
    );

    if (missing.length === 0) {
      return { passed: true, message: "✅ Correct solution" };
    }

    return {
      passed: false,
      message: `❌ Missing required elements: ${missing.join(", ")}`,
    };
  };

  // =========================
  // MARK TASK COMPLETE (NON-FINAL)
  // =========================
  const markTaskComplete = () => {
    const task = level.tasks[currentTaskIndex];

    // QUIZ VALIDATION
    if (task.type === "quiz") {
      const result = quizResults[currentTaskIndex];
      if (!result || !result.isCorrect) {
        alert("Please select the correct answer to continue.");
        return;
      }
    }

    // MOVE TO NEXT TASK
    setCurrentTaskIndex((prev) => prev + 1);
    setAnimateKey((k) => k + 1);
  };

  // =========================
  // FINAL CODING CHECK + COMPLETE
  // =========================
  const handleFinalCompletion = async () => {
    const task = level.tasks[currentTaskIndex];

    // FINAL CODING VALIDATION
    if (task.type === "coding") {
      const result = autoGradeCoding(
        task,
        codingAnswers[currentTaskIndex] || ""
      );

      setCodingResults((prev) => ({
        ...prev,
        [currentTaskIndex]: result,
      }));

      if (!result.passed) {
        return; // ❌ STOP HERE – backend NOT called
      }
    }

    // ✅ ONLY NOW call backend
    try {
      const res = await fetch(
        `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels/${levelIndex}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(
        data.alreadyCompleted
          ? "Level already completed."
          : `🎉 Level completed! +${data.xpAwarded} XP`
      );

      // Refresh user XP
      const dashRes = await fetch(
        "http://localhost:5000/api/dashboard/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setUser(dashData.user);
      }

      navigate(`/modules/${moduleId}/topics/${topicIndex}/levels`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-red-400 p-10">{error}</div>;
  if (!level) return null;

  const task = level.tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === level.tasks.length - 1;

  return (
    <div className="min-h-screen p-10 text-white animate-fade-in">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-1">{level.title}</h1>
      <p className="text-purple-400 mb-6">Reward: +{level.xp} XP</p>

      {/* SPLIT SCREEN */}
      <div className="grid grid-cols-2 gap-8 h-[70vh]">
        {/* LEFT: LEARN */}
        <div className="bg-gray-900 rounded-xl p-5 overflow-y-auto">
          <h3 className="text-purple-300 font-semibold mb-3">📘 Learn</h3>
          <ReactMarkdown>
            {level.contentMarkdown || level.content || ""}
          </ReactMarkdown>
        </div>

        {/* RIGHT: TASK */}
        <div
          key={animateKey}
          className="bg-gray-900 rounded-xl p-5 flex flex-col animate-slide-up"
        >
          <h3 className="text-purple-300 font-semibold mb-4 animate-pulse-glow">
            🎮 Challenge {currentTaskIndex + 1} / {level.tasks.length}
          </h3>

          {/* QUIZ */}
          {task.type === "quiz" && (
            <>
              <p className="mb-4 text-lg">{task.question}</p>

              {task.options.map((opt, i) => {
                const result = quizResults[currentTaskIndex];
                const isCorrect = opt === task.correctAnswer;
                const isSelected = result?.selected === opt;

                let style = "bg-gray-800 hover:bg-gray-700";

                if (result) {
                  if (isCorrect) style = "bg-green-700 animate-success";
                  else if (isSelected) style = "bg-red-700 animate-shake";
                }

                return (
                  <div
                    key={i}
                    onClick={() =>
                      setQuizResults((prev) => ({
                        ...prev,
                        [currentTaskIndex]: {
                          selected: opt,
                          isCorrect,
                        },
                      }))
                    }
                    className={`p-3 mb-2 rounded cursor-pointer transition-all ${style}`}
                  >
                    {opt}
                  </div>
                );
              })}
            </>
          )}

          {/* CODING */}
          {task.type === "coding" && (
            <>
              <p className="mb-3">{task.codingPrompt}</p>
              <textarea
                className="w-full h-40 p-3 bg-gray-800 rounded code-editor"
                placeholder="Write your code here..."
                value={codingAnswers[currentTaskIndex] || ""}
                onChange={(e) =>
                  setCodingAnswers((prev) => ({
                    ...prev,
                    [currentTaskIndex]: e.target.value,
                  }))
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

          {/* ACTION BUTTON */}
          <div className="mt-auto">
            {!isLastTask ? (
              <button
                onClick={markTaskComplete}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-all hover:scale-105"
              >
                Mark Task Complete
              </button>
            ) : (
              <button
                onClick={handleFinalCompletion}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-all hover:scale-105"
              >
                🏁 Mark Level Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelPlayerPage;
