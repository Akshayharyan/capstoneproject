import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TopicChallengesPage() {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [topic, setTopic] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ================= FETCH TOPIC ================= */
  useEffect(() => {
    const fetchTopic = async () => {
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics/${topicIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setTopic({
        ...data,
        tasks: Array.isArray(data.tasks) ? data.tasks : [],
      });
    };

    fetchTopic();
  }, [moduleId, topicIndex, token]);

  if (!topic) {
    return (
      <p className="text-center mt-32 text-gray-600 animate-pulse">
        Loading challenges…
      </p>
    );
  }

  const tasks = topic.tasks;
  const task = tasks[current];
  const isLast = current === tasks.length - 1;
  const progress = Math.round(((current + 1) / tasks.length) * 100);

  /* ================= NEXT ================= */
  const handleNext = () => {
    setError("");

    const answer = answers[current];

    // ❌ Empty
    if (!answer || answer.trim() === "") {
      setError("Please answer before continuing.");
      return;
    }

    // ❌ MCQ WRONG
    if (task.type === "quiz" && answer !== task.correctAnswer) {
      setError("❌ Wrong answer. Try again.");
      return;
    }

    // ✅ Correct
    setCurrent((c) => c + 1);
  };

  /* ================= FINAL SUBMIT ================= */
  const submitAll = async () => {
    setError("");

    const answer = answers[current];
    if (!answer || answer.trim() === "") {
      setError("Please answer before submitting.");
      return;
    }

    if (task.type === "quiz" && answer !== task.correctAnswer) {
      setError("❌ Wrong answer. Fix it before submitting.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        "http://localhost:5000/api/modules/complete-topic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleId,
            topicIndex: Number(topicIndex),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed");

      navigate(`/modules/${moduleId}/topics`);
    } catch {
      setError("❌ Failed to save progress.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
          {topic.title}
        </h1>

        {/* PROGRESS */}
        <div className="mb-10">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-600 mt-2">
            Question {current + 1} of {tasks.length}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">

          {/* QUESTION */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {task.type === "quiz" ? task.question : task.codingPrompt}
          </h2>

          {/* MCQ */}
          {task.type === "quiz" && (
            <div className="space-y-3">
              {task.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block p-4 rounded-xl border cursor-pointer transition
                    ${
                      answers[current] === opt
                        ? "bg-indigo-50 border-indigo-500 text-gray-900"
                        : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name={`q-${current}`}
                    className="mr-3"
                    onChange={() =>
                      setAnswers({ ...answers, [current]: opt })
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* CODING */}
          {task.type === "coding" && (
            <textarea
              className="w-full h-44 border border-gray-300 rounded-xl p-4 font-mono text-gray-900"
              placeholder="Write your code here…"
              value={answers[current] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [current]: e.target.value })
              }
            />
          )}

          {/* ERROR */}
          {error && (
            <p className="mt-4 flex items-center gap-2 text-red-600 font-medium">
              <XCircle /> {error}
            </p>
          )}

          {/* ACTION */}
          <div className="mt-8 flex justify-end">
            {!isLast ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold flex items-center gap-2 hover:bg-indigo-700"
              >
                Next <ChevronRight />
              </button>
            ) : (
              <button
                disabled={saving}
                onClick={submitAll}
                className="px-10 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center gap-2"
              >
                <CheckCircle />
                {saving ? "Submitting…" : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
