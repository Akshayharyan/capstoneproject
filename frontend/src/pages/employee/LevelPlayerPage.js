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

  // 🧠 Track answers per task
  const [quizAnswers, setQuizAnswers] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});

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
  // VALIDATE TASKS
  // =========================
  const allTasksCompleted = () => {
    if (!level?.tasks) return true;

    return level.tasks.every((task, index) => {
      if (task.type === "quiz") {
        return quizAnswers[index] !== undefined;
      }
      if (task.type === "coding") {
        return codingAnswers[index]?.trim().length > 0;
      }
      return true;
    });
  };

  // =========================
  // COMPLETE LEVEL
  // =========================
  const submitCompletion = async () => {
    if (!allTasksCompleted()) {
      alert("Please complete all tasks before finishing the level.");
      return;
    }

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
      if (!res.ok) throw new Error(data.message || "Completion failed");

      alert(
        data.alreadyCompleted
          ? "Level already completed. No XP awarded."
          : `Level completed! XP earned: ${data.xpAwarded}`
      );

      // refresh user XP
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
      alert(err.message || "Server error");
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-red-400 p-10">{error}</div>;
  if (!level) return <div className="text-white p-10">Level not found</div>;

  return (
    <div className="p-10 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{level.title}</h1>

      {/* LEARNING */}
      <section className="mb-6 bg-gray-900 p-5 rounded-xl">
        <h3 className="text-purple-300 font-semibold mb-3">Learning</h3>
        <ReactMarkdown>
          {level.contentMarkdown || level.content || ""}
        </ReactMarkdown>
      </section>

      {/* TASKS */}
      {Array.isArray(level.tasks) && level.tasks.length > 0 ? (
        level.tasks.map((task, index) => (
          <section
            key={index}
            className="bg-gray-900 p-5 rounded-xl mb-6"
          >
            <h3 className="text-purple-300 font-semibold mb-4">
              Task {index + 1}
            </h3>

            {/* QUIZ */}
            {task.type === "quiz" && (
              <>
                <p className="mb-4">{task.question}</p>
                {task.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`block mb-2 p-3 rounded bg-gray-800 cursor-pointer ${
                      quizAnswers[index] === opt
                        ? "ring-2 ring-purple-500"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${index}`}
                      className="mr-2"
                      checked={quizAnswers[index] === opt}
                      onChange={() =>
                        setQuizAnswers({
                          ...quizAnswers,
                          [index]: opt,
                        })
                      }
                    />
                    {opt}
                  </label>
                ))}
              </>
            )}

            {/* CODING */}
            {task.type === "coding" && (
              <>
                <p className="mb-3">{task.codingPrompt}</p>
                <textarea
                  className="w-full h-40 p-3 bg-gray-800 rounded"
                  value={codingAnswers[index] || ""}
                  onChange={(e) =>
                    setCodingAnswers({
                      ...codingAnswers,
                      [index]: e.target.value,
                    })
                  }
                  placeholder="Write your code here..."
                />
              </>
            )}
          </section>
        ))
      ) : (
        <p className="text-gray-400">No tasks attached to this level.</p>
      )}

      {/* COMPLETE BUTTON */}
      <button
        onClick={submitCompletion}
        className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg"
      >
        Mark Level Complete
      </button>
    </div>
  );
};

export default LevelPlayerPage;
