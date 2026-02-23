import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CodeSandbox from "../../components/CodeSandbox";

export default function TopicChallengesPage() {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [topic, setTopic] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD TOPIC ================= */

  useEffect(() => {
    const loadTopic = async () => {
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics/${topicIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTopic({ ...data, tasks: data.tasks || [] });
      setLoading(false);
    };
    loadTopic();
  }, [moduleId, topicIndex, token]);

  useEffect(() => {
    setAnswerIndex(null);
    setFeedback("");
  }, [current]);

  if (loading)
    return <div className="text-center text-xl mt-40 text-gray-600">Loading challenges...</div>;

  if (!topic || !topic.tasks.length)
    return <div className="text-center text-gray-500 mt-40">No challenges found</div>;

  const tasks = topic.tasks;
  const task = tasks[current];
  const isLast = current === tasks.length - 1;

  const coding = task.content?.coding;
  const quiz = task.content?.quiz;
  const bugfix = task.content?.bugfix;

  const progress = ((current + 1) / tasks.length) * 100;

  /* ================= QUIZ ================= */

  const submitQuiz = () => {
    if (answerIndex === null)
      return setFeedback("⚠️ Select an option");

    if (answerIndex !== quiz.correctIndex)
      return setFeedback("❌ Incorrect – try again!");

    next();
  };

  const next = () => isLast ? finish() : setCurrent(c => c + 1);

  const finish = async () => {
    await fetch("http://localhost:5000/api/modules/complete-topic", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ moduleId, topicIndex: Number(topicIndex) })
    });

    setCompleted(true);
    setTimeout(() => navigate(`/modules/${moduleId}/topics`), 1500);
  };

  if (completed)
    return (
      <div className="h-screen flex items-center justify-center text-4xl font-bold text-green-600">
        🎉 Topic Mastered!
      </div>
    );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-6 py-24">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROGRESS */}

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="bg-white/80 backdrop-blur-lg border shadow-2xl rounded-3xl p-8 space-y-6">

            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {topic.title}
              </h1>
              <p className="text-gray-500 mt-1">
                Challenge {current + 1} / {tasks.length}
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              {task.title} <span className="text-indigo-600">({task.type})</span>
            </h2>

            {/* CODING */}

            {task.type === "coding" && (
              <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded-xl text-gray-800">
                {coding.prompt}
              </div>
            )}

            {/* BUGFIX */}

            {task.type === "bugfix" && (
              <div className="space-y-3">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm">
{bugfix.buggyCode}
                </pre>
                {bugfix.hint && (
                  <p className="text-indigo-600 font-medium">
                    💡 Hint: {bugfix.hint}
                  </p>
                )}
              </div>
            )}

            {/* QUIZ */}

            {task.type === "quiz" && (
              <div className="space-y-3">
                <p className="font-medium text-gray-800">{quiz.question}</p>

                {quiz.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswerIndex(i)}
                    className={`w-full text-left p-3 rounded-xl border transition
                    ${answerIndex === i
                        ? "bg-indigo-200 border-indigo-500"
                        : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {feedback && (
              <p className="font-semibold text-red-600">{feedback}</p>
            )}

            {task.type === "quiz" && (
              <button
                onClick={submitQuiz}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow hover:scale-105 transition"
              >
                Submit Answer
              </button>
            )}

          </div>

          {/* RIGHT */}

          {(task.type === "coding" || task.type === "bugfix") && (
            <div className="bg-white/90 backdrop-blur border shadow-2xl rounded-3xl p-6">

              <CodeSandbox
                language="javascript"
                starterCode={
                  task.type === "coding"
                    ? coding.starterCode
                    : bugfix.buggyCode
                }

                onRun={async (code) => {
                  const res = await fetch("http://localhost:5000/api/grader/grade", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      moduleId,
                      topicIndex: Number(topicIndex),
                      taskIndex: current,
                      code
                    })
                  });

                  const data = await res.json();
                  if (!data.success) return data.message;

                  return data.results
                    .map(r => `Input ${r.input} → ${r.actual} ${r.pass ? "✅" : "❌"}`)
                    .join("\n");
                }}

                onSubmit={async (code) => {
                  const res = await fetch("http://localhost:5000/api/grader/grade", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      moduleId,
                      topicIndex: Number(topicIndex),
                      taskIndex: current,
                      code
                    })
                  });

                  const data = await res.json();
                  if (!data.success) return data.message;

                  next();
                  return "🎉 All test cases passed!";
                }}
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}