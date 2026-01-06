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
    return <p className="text-white">Loading tasks...</p>;
  }

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">🧪 Manage Topic Tasks</h2>

      {/* ADD TASK */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <select
          value={newTask.type}
          onChange={(e) =>
            setNewTask({ ...newTask, type: e.target.value })
          }
          className="mb-4 px-4 py-2 bg-gray-800 rounded"
        >
          <option value="quiz">Quiz</option>
          <option value="coding">Coding</option>
        </select>

        {newTask.type === "quiz" && (
          <>
            <input
              placeholder="Question"
              className="w-full mb-2 px-4 py-2 bg-gray-800 rounded"
              value={newTask.question}
              onChange={(e) =>
                setNewTask({ ...newTask, question: e.target.value })
              }
            />

            {newTask.options.map((opt, i) => (
              <input
                key={i}
                placeholder={`Option ${i + 1}`}
                className="w-full mb-2 px-4 py-2 bg-gray-800 rounded"
                value={opt}
                onChange={(e) => {
                  const updated = [...newTask.options];
                  updated[i] = e.target.value;
                  setNewTask({ ...newTask, options: updated });
                }}
              />
            ))}

            <input
              placeholder="Correct Answer"
              className="w-full mb-2 px-4 py-2 bg-gray-800 rounded"
              value={newTask.correctAnswer}
              onChange={(e) =>
                setNewTask({ ...newTask, correctAnswer: e.target.value })
              }
            />
          </>
        )}

        {newTask.type === "coding" && (
          <>
            <textarea
              placeholder="Coding Prompt"
              className="w-full mb-2 px-4 py-2 bg-gray-800 rounded"
              value={newTask.codingPrompt}
              onChange={(e) =>
                setNewTask({ ...newTask, codingPrompt: e.target.value })
              }
            />
            <textarea
              placeholder="Starter Code"
              className="w-full mb-2 px-4 py-2 bg-gray-800 rounded"
              value={newTask.starterCode}
              onChange={(e) =>
                setNewTask({ ...newTask, starterCode: e.target.value })
              }
            />
          </>
        )}

        <input
          type="number"
          placeholder="XP"
          className="w-full mb-4 px-4 py-2 bg-gray-800 rounded"
          value={newTask.xp}
          onChange={(e) =>
            setNewTask({ ...newTask, xp: e.target.value })
          }
        />

        <button
          type="button"
          onClick={addTask}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          ➕ Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.map((t, i) => (
          <div
            key={i}
            className="bg-gray-900 p-4 rounded border border-gray-700"
          >
            <p className="font-semibold">
              {t.type.toUpperCase()} — ⭐ {t.xp} XP
            </p>
            {t.question && <p>{t.question}</p>}
            {t.codingPrompt && <p>{t.codingPrompt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
