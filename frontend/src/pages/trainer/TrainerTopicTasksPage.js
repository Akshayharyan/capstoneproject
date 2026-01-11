import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TrainerTopicTasksPage() {
  const { moduleId, topicIndex } = useParams();
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    type: "quiz",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    codingPrompt: "",
    starterCode: "",
    testCases: [],
    xp: 0,
  });

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [moduleId, topicIndex, token]);

  /* ================= ADD TASK ================= */
  const addTask = async () => {
    const payload = {
      type: newTask.type,
      xp: Number(newTask.xp) || 0,
    };

    if (newTask.type === "quiz") {
      payload.question = newTask.question.trim();
      payload.options = newTask.options.filter(Boolean);
      payload.correctAnswer = newTask.correctAnswer.trim();
    } else {
      payload.codingPrompt = newTask.codingPrompt.trim();
      payload.starterCode = newTask.starterCode;
      payload.testCases = newTask.testCases;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/task`,
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
      if (!res.ok) {
        alert(data.message || "Failed to add task");
        return;
      }

      setTasks((prev) => [...prev, data.task]);
      setNewTask({
        type: "quiz",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        codingPrompt: "",
        starterCode: "",
        testCases: [],
        xp: 0,
      });
    } catch (err) {
      console.error("Add task failed:", err);
      alert("Server error while adding task");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      <div className="max-w-5xl px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-orange-500">
            Manage Topic Tasks
          </h1>
          <p className="text-gray-600">
            Add quizzes or coding challenges for this topic
          </p>
        </div>

        {/* ADD TASK CARD */}
        <div className="bg-white rounded-xl p-6 mb-10 border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Type
          </label>
          <select
            value={newTask.type}
            onChange={(e) =>
              setNewTask({ ...newTask, type: e.target.value })
            }
            className="mb-6 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="quiz">Quiz</option>
            <option value="coding">Coding</option>
          </select>

          {/* QUIZ FORM */}
          {newTask.type === "quiz" && (
            <div className="space-y-3">
              <Input
                label="Question"
                value={newTask.question}
                onChange={(v) =>
                  setNewTask({ ...newTask, question: v })
                }
              />

              {newTask.options.map((opt, i) => (
                <Input
                  key={i}
                  label={`Option ${i + 1}`}
                  value={opt}
                  onChange={(v) => {
                    const updated = [...newTask.options];
                    updated[i] = v;
                    setNewTask({ ...newTask, options: updated });
                  }}
                />
              ))}

              <Input
                label="Correct Answer"
                value={newTask.correctAnswer}
                onChange={(v) =>
                  setNewTask({ ...newTask, correctAnswer: v })
                }
              />
            </div>
          )}

          {/* CODING FORM */}
          {newTask.type === "coding" && (
            <div className="space-y-3">
              <Textarea
                label="Coding Prompt"
                value={newTask.codingPrompt}
                onChange={(v) =>
                  setNewTask({ ...newTask, codingPrompt: v })
                }
              />
              <Textarea
                label="Starter Code"
                value={newTask.starterCode}
                onChange={(v) =>
                  setNewTask({ ...newTask, starterCode: v })
                }
              />
            </div>
          )}

          <Input
            label="XP Reward"
            type="number"
            value={newTask.xp}
            onChange={(v) =>
              setNewTask({ ...newTask, xp: v })
            }
            width="w-32"
          />

          <button
            type="button"
            onClick={addTask}
            className="mt-4 px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold"
          >
            Add Task
          </button>
        </div>

        {/* TASK LIST */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Existing Tasks
          </h3>

          {tasks.length === 0 && (
            <p className="text-gray-500">No tasks added yet.</p>
          )}

          <div className="space-y-4">
            {tasks.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <p className="font-semibold">
                  {t.type.toUpperCase()} — ⭐ {t.xp} XP
                </p>
                {t.question && (
                  <p className="text-gray-700 mt-1">
                    {t.question}
                  </p>
                )}
                {t.codingPrompt && (
                  <p className="text-gray-700 mt-1">
                    {t.codingPrompt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Small Reusable Inputs ===== */

const Input = ({ label, value, onChange, type = "text", width }) => (
  <div className={width || "w-full"}>
    <label className="block text-sm text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-gray-300"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border border-gray-300"
    />
  </div>
);
