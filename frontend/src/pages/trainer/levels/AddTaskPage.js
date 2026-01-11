// frontend/src/pages/trainer/AddTaskPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function AddTaskPage() {
  const { moduleId, topicIndex, levelIndex } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [taskType, setTaskType] = useState("quiz");

  // quiz
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [quizXp, setQuizXp] = useState(5);

  // coding
  const [codingPrompt, setCodingPrompt] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState('[{ "input": "", "output": "" }]');
  const [codingXp, setCodingXp] = useState(10);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level/${levelIndex}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const updateOption = (idx, val) => {
    const copy = [...options];
    copy[idx] = val;
    setOptions(copy);
  };

  /* ================= ADD QUIZ ================= */
  const addQuizTask = async () => {
    if (!question) return alert("Question required");
    if (options.some((o) => !o)) return alert("All options required");

    const payload = {
      type: "quiz",
      question,
      options,
      correctAnswer: Number(correctIndex),
      xp: Number(quizXp),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level/${levelIndex}/task`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
      setQuizXp(5);
      fetchTasks();
    } catch (err) {
      alert(err.message || "Server error");
    }
  };

  /* ================= ADD CODING ================= */
  const addCodingTask = async () => {
    if (!codingPrompt) return alert("Prompt required");

    let parsedTests;
    try {
      parsedTests = JSON.parse(testCases);
    } catch {
      return alert("Test cases must be valid JSON");
    }

    const payload = {
      type: "coding",
      codingPrompt,
      starterCode,
      testCases: parsedTests,
      xp: Number(codingXp),
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level/${levelIndex}/task`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setCodingPrompt("");
      setStarterCode("");
      setTestCases('[{ "input": "", "output": "" }]');
      setCodingXp(10);
      fetchTasks();
    } catch (err) {
      alert(err.message || "Server error");
    }
  };

  const handleDelete = async (idx) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level/${levelIndex}/task/${idx}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      fetchTasks();
    } catch (err) {
      alert(err.message || "Server error");
    }
  };

  return (
    <div
      className="p-10 min-h-screen"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-orange-500">
          Manage Tasks
        </h1>
        <p className="text-gray-600">
          Level {Number(levelIndex) + 1}
        </p>
      </div>

      {/* Task Type */}
      <div className="mb-6 max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Type
        </label>
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="quiz">Quiz</option>
          <option value="coding">Coding</option>
        </select>
      </div>

      {/* QUIZ */}
      {taskType === "quiz" && (
        <Card title="Add Quiz Question">
          <Input label="Question" value={question} onChange={setQuestion} />
          <div className="grid gap-2">
            {options.map((o, i) => (
              <Input
                key={i}
                label={`Option ${i + 1}`}
                value={o}
                onChange={(v) => updateOption(i, v)}
              />
            ))}
          </div>

          <Input
            label="Correct Option Index (0–3)"
            type="number"
            value={correctIndex}
            onChange={setCorrectIndex}
          />

          <Input
            label="XP"
            type="number"
            value={quizXp}
            onChange={setQuizXp}
            width="w-32"
          />

          <PrimaryButton onClick={addQuizTask}>
            Add Quiz Task
          </PrimaryButton>
        </Card>
      )}

      {/* CODING */}
      {taskType === "coding" && (
        <Card title="Add Coding Task">
          <Textarea label="Prompt" value={codingPrompt} onChange={setCodingPrompt} />
          <Textarea label="Starter Code" rows={6} value={starterCode} onChange={setStarterCode} />
          <Textarea label="Test Cases (JSON)" rows={6} value={testCases} onChange={setTestCases} />

          <Input
            label="XP"
            type="number"
            value={codingXp}
            onChange={setCodingXp}
            width="w-32"
          />

          <PrimaryButton onClick={addCodingTask}>
            Add Coding Task
          </PrimaryButton>
        </Card>
      )}

      {/* EXISTING TASKS */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Existing Tasks</h3>

        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks yet.</p>
        )}

        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 flex justify-between items-center"
              style={{
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div>
                <strong>{t.type.toUpperCase()}</strong>{" "}
                — {t.question || t.codingPrompt?.slice(0, 80) || "Task"}
                <div className="text-sm text-gray-500">XP: {t.xp}</div>
              </div>

              <button
                onClick={() => handleDelete(i)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 mr-3"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

/* ===== Reusable UI ===== */

const Card = ({ title, children }) => (
  <div
    className="bg-white rounded-xl p-6 mb-6 max-w-3xl"
    style={{
      border: "1px solid var(--border-light)",
      boxShadow: "var(--shadow-soft)",
    }}
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, value, onChange, type = "text", width }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className={`px-4 py-2 rounded-lg border border-gray-300 w-full ${width || ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange, rows = 4 }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <textarea
      rows={rows}
      className="px-4 py-2 rounded-lg border border-gray-300 w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const PrimaryButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold"
  >
    {children}
  </button>
);
