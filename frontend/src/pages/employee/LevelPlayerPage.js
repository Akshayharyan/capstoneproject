import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";

const LevelPlayerPage = () => {
  const { moduleId, topicIndex, levelIndex } = useParams();
  const { token } = useAuth();
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

  const fetchLevel = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/employee/module/${moduleId}/topics/${topicIndex}/levels/${levelIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load level");
      }

      // 🔐 FIX: backend returns level directly (not wrapped)
      setLevel(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCompletion = async () => {
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

      if (!res.ok) {
        throw new Error(data.message || "Completion failed");
      }

      alert(`Completed! XP +${data.xpAwarded || 0}`);
      navigate(`/modules/${moduleId}/topics/${topicIndex}/levels`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-white p-10">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!level) {
    return <div className="text-white p-10">Level not found</div>;
  }

  // pick first task (for now)
  const task =
    level.tasks && level.tasks.length > 0 ? level.tasks[0] : null;

  return (
    <div className="p-10 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{level.title}</h1>

      {/* Learning Content */}
      <section className="mb-6 bg-gray-900 p-4 rounded">
        <h3 className="font-semibold mb-2">Learning</h3>
        <div className="prose max-w-none">
          <ReactMarkdown>
            {level.contentMarkdown || level.content || ""}
          </ReactMarkdown>
        </div>
      </section>

      {/* Task */}
      {task ? (
        <section className="bg-gray-900 p-4 rounded">
          <h3 className="font-semibold mb-4">Challenge</h3>

          {task.type === "quiz" && (
            <>
              <p className="mb-4">{task.question}</p>
              {task.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block mb-2 p-3 rounded cursor-pointer bg-gray-800 ${
                    selectedOption === opt
                      ? "ring-2 ring-purple-500"
                      : ""
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
                className="w-full h-40 p-3 bg-gray-800 rounded mb-3"
                value={codingAnswer}
                onChange={(e) => setCodingAnswer(e.target.value)}
                placeholder="Write your solution code here..."
              />
              <p className="text-sm text-gray-400">
                Auto-grader not implemented — marking complete is manual.
              </p>
            </>
          )}

          <div className="mt-4">
            <button
              onClick={submitCompletion}
              className="px-6 py-2 bg-purple-600 rounded"
            >
              Mark Complete
            </button>
          </div>
        </section>
      ) : (
        <p>No challenge attached to this level.</p>
      )}
    </div>
  );
};

export default LevelPlayerPage;
