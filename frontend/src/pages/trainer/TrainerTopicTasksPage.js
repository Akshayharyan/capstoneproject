import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TrainerTopicTasksPage() {
  const { moduleId, topicIndex } = useParams();
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [testCaseDrafts, setTestCaseDrafts] = useState({});

  const emptyForm = {
    type: "coding",
    title: "",
    description: "",
    starterCode: "",
    options: ["", "", "", ""],
    correctOption: 0
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD ================= */

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setTasks(data.success ? data.tasks : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId, topicIndex, token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /* ================= ADD / UPDATE ================= */

  const submitTask = async () => {
    if (!form.title.trim() || !form.description.trim())
      return alert("Title & description required");

    if (form.type === "quiz" && form.options.some(o => !o.trim()))
      return alert("Fill all quiz options");

    const payload = {
      type: form.type,
      title: form.title,
      description: form.description,
      starterCode: form.starterCode,
      options: form.type === "quiz" ? form.options : [],
      correctOption: form.type === "quiz" ? form.correctOption : null
    };

    const url =
      editingIndex === null
        ? `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/task`
        : `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/task/${editingIndex}`;

    const method = editingIndex === null ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      setTasks(data.tasks);
      setForm(emptyForm);
      setEditingIndex(null);
    }
  };

  /* ================= DELETE ================= */

  const deleteTask = async (index) => {
    if (!window.confirm("Delete this task?")) return;

    await fetch(
      `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/task/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    loadTasks();
  };

  /* ================= EDIT ================= */

  const startEdit = (task, index) => {
    setEditingIndex(index);

    let description = "";
    let starterCode = "";
    let options = ["", "", "", ""];
    let correctOption = 0;

    if (task.type === "coding") {
      description = task.content?.coding?.prompt || "";
      starterCode = task.content?.coding?.starterCode || "";
    }

    if (task.type === "quiz") {
      description = task.content?.quiz?.question || "";
      options = task.content?.quiz?.options || options;
      correctOption = task.content?.quiz?.correctIndex ?? 0;
    }

    if (task.type === "bugfix") {
      description = task.content?.bugfix?.hint || "";
      starterCode = task.content?.bugfix?.buggyCode || "";
    }

    setForm({
      type: task.type,
      title: task.title || "",
      description,
      starterCode,
      options,
      correctOption
    });
  };

  /* ================= ADD TEST CASE ================= */

  const addTestCase = async (taskIndex) => {
    const draft = testCaseDrafts[taskIndex];

    if (!draft?.input?.trim() || !draft?.output?.trim())
      return alert("Input & Output required");

    const res = await fetch(
      `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/task/${taskIndex}/testcase`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(draft)
      }
    );

    const data = await res.json();

    if (data.success) {
      await loadTasks();
      setTestCaseDrafts(p => ({
        ...p,
        [taskIndex]: { input: "", output: "" }
      }));
    }
  };

  if (loading)
    return <p className="p-10 text-gray-500">Loading tasks...</p>;

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto py-14 px-10 space-y-12">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Topic Task Builder
        </h1>
        <p className="text-gray-500 mt-2">
          Create coding, quiz, and bug-fix challenges.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">

        <select
          className="w-full p-3 border rounded-lg"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="coding">Coding</option>
          <option value="quiz">Quiz</option>
          <option value="bugfix">Bug Fix</option>
        </select>

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full p-3 border rounded-lg h-24"
          placeholder="Task description / hint"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {form.type !== "quiz" && (
          <textarea
            className="w-full p-3 border rounded-lg h-32 font-mono text-sm"
            placeholder={form.type === "bugfix" ? "Buggy code" : "Starter code"}
            value={form.starterCode}
            onChange={(e) => setForm({ ...form, starterCode: e.target.value })}
          />
        )}

        {form.type === "quiz" &&
          form.options.map((opt, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                className="flex-1 p-2 border rounded-lg"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const ops = [...form.options];
                  ops[i] = e.target.value;
                  setForm({ ...form, options: ops });
                }}
              />
              <input
                type="radio"
                checked={form.correctOption === i}
                onChange={() => setForm({ ...form, correctOption: i })}
              />
            </div>
          ))}

        <button
          onClick={submitTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          {editingIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* ================= TASK LIST ================= */}

      <div className="space-y-6">

        {tasks.map((task, i) => {
          const testCases =
            task.type === "coding"
              ? task.content?.coding?.testCases
              : task.type === "bugfix"
              ? task.content?.bugfix?.testCases
              : [];

          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >

              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  {task.title}
                  <span className="ml-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                    {task.type}
                  </span>
                </h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(task, i)}
                    className="text-yellow-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(i)}
                    className="text-red-500 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {(task.type === "coding" || task.type === "bugfix") && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-3">

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="p-2 border rounded-lg text-sm"
                      placeholder="Input"
                      value={testCaseDrafts[i]?.input || ""}
                      onChange={(e) =>
                        setTestCaseDrafts(p => ({
                          ...p,
                          [i]: { ...p[i], input: e.target.value }
                        }))
                      }
                    />

                    <input
                      className="p-2 border rounded-lg text-sm"
                      placeholder="Output"
                      value={testCaseDrafts[i]?.output || ""}
                      onChange={(e) =>
                        setTestCaseDrafts(p => ({
                          ...p,
                          [i]: { ...p[i], output: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <button
                    onClick={() => addTestCase(i)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Add Test Case
                  </button>

                  {testCases?.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {testCases.map((tc, idx) => (
                        <p key={idx}>
                          {tc.input} → {tc.output}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}