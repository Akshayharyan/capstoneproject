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

  const [selectedOption, setSelectedOption] = useState(null);
  const [codingAnswer, setCodingAnswer] = useState("");

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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COMPLETE LEVEL
  // =========================
  const submitCompletion = async () => {
    try {
      if (task?.type === "quiz" && selectedOption === null) {
        alert("Please select an answer before completing the level.");
        return;
      }

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

      // ✅ HONEST MESSAGE
      if (data.alreadyCompleted) {
        alert("Level already completed. No XP awarded.");
      } else {
        alert(`Level completed! XP earned: ${data.xpAwarded}`);
      }

      // 🔁 Refresh user XP in sidebar
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

  if (error)
    return (
      <div className="text-white p-10">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );

  if (!level) return <div className="text-white p-10">Level not found</div>;

  const task =
    Array.isArray(level.tasks) && level.tasks.length > 0
      ? level.tasks[0]
      : null;

  return (
    <div className="p-10 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{level.title}</h1>

      {/* LEARNING */}
      <section className="mb-6 bg-gray-900 p-5 rounded-xl">
        <h3 className="font-semibold mb-3 text-purple-300">Learning</h3>
        <div className="prose max-w-none">
          <ReactMarkdown>
            {level.contentMarkdown || level.content || ""}
          </ReactMarkdown>
        </div>
      </section>

      {/* CHALLENGE */}
      {task ? (
        <section className="bg-gray-900 p-5 rounded-xl">
          <h3 className="font-semibold mb-4 text-purple-300">Challenge</h3>

          {task.type === "quiz" && (
            <>
              <p className="mb-4">{task.question}</p>
              {task.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block mb-3 p-3 rounded-lg cursor-pointer bg-gray-800 ${
                    selectedOption === opt
                      ? "ring-2 ring-purple-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    className="mr-2"
                    checked={selectedOption === opt}
                    onChange={() => setSelectedOption(opt)}
                  />
                  {opt}
                </label>
              ))}
            </>
          )}

          {task.type === "coding" && (
            <>
              <p className="mb-3">{task.codingPrompt}</p>
              <textarea
                className="w-full h-44 p-3 bg-gray-800 rounded-lg mb-3"
                value={codingAnswer}
                onChange={(e) => setCodingAnswer(e.target.value)}
              />
              <p className="text-sm text-gray-400">
                Auto-grader not implemented.
              </p>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={submitCompletion}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Mark Complete
            </button>
          </div>
        </section>
      ) : (
        <p className="text-gray-400">No challenge attached to this level.</p>
      )}
    </div>
  );
};

export default LevelPlayerPage;
