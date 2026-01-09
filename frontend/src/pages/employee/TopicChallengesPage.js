import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ChevronRight,
  XCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TopicChallengesPage() {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();

  const [topic, setTopic] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const [codeTested, setCodeTested] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  /* ================= FETCH TOPIC ================= */
  useEffect(() => {
    const fetchTopic = async () => {
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics/${topicIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  /* ================= NO TASKS ================= */
  if (tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Challenges
          </h2>
          <p className="text-gray-600 mb-6">
            This topic has no quiz or coding tasks.
          </p>
          <button
            onClick={() => navigate(`/modules/${moduleId}/topics`)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const task = tasks[current];
  const isLast = current === tasks.length - 1;
  const progress = Math.round(((current + 1) / tasks.length) * 100);

  /* ================= NEXT ================= */
  const handleNext = () => {
    setError("");
    const answer = answers[current];

    if (!answer || answer.trim() === "") {
      setError("Please answer before continuing.");
      return;
    }

    if (task.type === "quiz" && answer !== task.correctAnswer) {
      setError("❌ Wrong answer. Try again.");
      return;
    }

    setCurrent((c) => c + 1);
  };

  /* ================= TEST CODE ================= */
  const testCode = async () => {
    setError("");
    setTestMessage("");

    const code = answers[current];
    if (!code || code.trim() === "") {
      setError("Please write code before testing.");
      return;
    }

    try {
     

      const res = await fetch("http://localhost:5000/api/grader/grade", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          topicIndex: Number(topicIndex),
          taskIndex: current,
          code,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setCodeTested(false);
        setError(data.message || "❌ Code validation failed.");
        return;
      }

      setCodeTested(true);
      setTestMessage("✅ Code is correct. You can submit now!");
    } catch {
      setError("❌ Grader error.");
    } finally {
      
    }
  };

  /* ================= SUBMIT ================= */
  const submitAll = async () => {
    if (task.type === "coding" && !codeTested) {
      setError("Please test your code before submitting.");
      return;
    }

    try {
      

      await fetch("http://localhost:5000/api/modules/complete-topic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId,
          topicIndex: Number(topicIndex),
        }),
      });

      // 🔥 REAL-TIME UNLOCK
      await refreshUser();

      setCompleted(true);
      setTimeout(() => navigate(`/modules/${moduleId}/topics`), 1500);
    } catch {
      setError("❌ Failed to complete topic.");
    } finally {
    
    }
  };

  /* ================= COMPLETED ================= */
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Topic Completed 🎉
          </h2>
          <p className="text-gray-600">Next topic unlocked!</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
          {topic.title}
        </h1>

        {/* PROGRESS */}
        <div className="mb-10">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-600 mt-2">
            Question {current + 1} of {tasks.length}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {task.type === "quiz" ? task.question : task.codingPrompt}
          </h2>

          {/* QUIZ */}
          {task.type === "quiz" && (
            <div className="space-y-4">
              {task.options.map((opt, i) => {
                const selected = answers[current] === opt;
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                      ${
                        selected
                          ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                          : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`q-${current}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers({ ...answers, [current]: opt })
                      }
                      className="accent-indigo-600"
                    />
                    <span className="font-medium">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* CODING */}
          {task.type === "coding" && (
            <>
              <textarea
                className="w-full h-44 p-4 border-2 border-indigo-500 rounded-xl
                           bg-white text-gray-900 font-mono
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your HTML code here…"
                value={answers[current] || ""}
                onChange={(e) => {
                  setAnswers({ ...answers, [current]: e.target.value });
                  setCodeTested(false);
                  setTestMessage("");
                }}
              />

              {testMessage && (
                <p className="mt-4 text-green-600 font-medium flex gap-2">
                  <CheckCircle /> {testMessage}
                </p>
              )}
            </>
          )}

          {error && (
            <p className="mt-4 text-red-600 font-medium flex gap-2">
              <XCircle /> {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex justify-end gap-4">
            {!isLast ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-600 text-white rounded-full"
              >
                Next <ChevronRight />
              </button>
            ) : (
              <>
                {task.type === "coding" && (
                  <button
                    onClick={testCode}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-full flex gap-2"
                  >
                    <Play /> Test Code
                  </button>
                )}

                <button
                  onClick={submitAll}
                  disabled={task.type === "coding" && !codeTested}
                  className={`px-10 py-3 rounded-full font-semibold flex gap-2 items-center
                    ${
                      task.type === "coding" && !codeTested
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                  <CheckCircle /> Submit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
