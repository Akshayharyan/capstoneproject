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

    // quiz
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",

    // coding
    codingPrompt: "",
    starterCode: "",
    language: "html",

    gradingRules: {
      requiredTags: "",
      textIncludes: "",
      forbiddenTags: "",
    },

    xp: 0,
  });

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error(err);
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
    }

    if (newTask.type === "coding") {
      payload.codingPrompt = newTask.codingPrompt.trim();
      payload.starterCode = newTask.starterCode;
      payload.language = newTask.language;

      payload.gradingRules = {
        requiredTags: newTask.gradingRules.requiredTags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        textIncludes: newTask.gradingRules.textIncludes
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),

        forbiddenTags: newTask.gradingRules.forbiddenTags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
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
      if (!res.ok) return alert(data.message || "Failed");

      setTasks((prev) => [...prev, data.task]);
      resetForm();
    } catch (err) {
      alert("Server error");
    }
  };

  const resetForm = () =>
    setNewTask({
      type: "quiz",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      codingPrompt: "",
      starterCode: "",
      language: "html",
      gradingRules: {
        requiredTags: "",
        textIncludes: "",
        forbiddenTags: "",
      },
      xp: 0,
    });

  if (loading) return <p className="text-gray-500">Loading tasks…</p>;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      <div className="max-w-5xl px-10 py-10">
        <h1 className="text-3xl font-extrabold text-orange-500 mb-6">
          Manage Topic Tasks
        </h1>

        {/* ADD TASK */}
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-10">
          <Select
            label="Task Type"
            value={newTask.type}
            options={["quiz", "coding"]}
            onChange={(v) => setNewTask({ ...newTask, type: v })}
          />

          {/* QUIZ */}
          {newTask.type === "quiz" && (
            <>
              <Input label="Question" value={newTask.question}
                onChange={(v) => setNewTask({ ...newTask, question: v })} />

              {newTask.options.map((o, i) => (
                <Input key={i} label={`Option ${i + 1}`} value={o}
                  onChange={(v) => {
                    const opts = [...newTask.options];
                    opts[i] = v;
                    setNewTask({ ...newTask, options: opts });
                  }} />
              ))}

              <Input label="Correct Answer" value={newTask.correctAnswer}
                onChange={(v) =>
                  setNewTask({ ...newTask, correctAnswer: v })} />
            </>
          )}

          {/* CODING */}
          {newTask.type === "coding" && (
            <>
              <Select
                label="Language"
                value={newTask.language}
                options={["html", "css", "javascript", "python", "java"]}
                onChange={(v) =>
                  setNewTask({ ...newTask, language: v })}
              />

              <Textarea label="Coding Prompt"
                value={newTask.codingPrompt}
                onChange={(v) =>
                  setNewTask({ ...newTask, codingPrompt: v })} />

              <Textarea label="Starter Code"
                value={newTask.starterCode}
                onChange={(v) =>
                  setNewTask({ ...newTask, starterCode: v })} />

              <Input label="Required Tags (comma separated)"
                value={newTask.gradingRules.requiredTags}
                onChange={(v) =>
                  setNewTask({
                    ...newTask,
                    gradingRules: { ...newTask.gradingRules, requiredTags: v },
                  })} />

              <Input label="Text Must Include"
                value={newTask.gradingRules.textIncludes}
                onChange={(v) =>
                  setNewTask({
                    ...newTask,
                    gradingRules: { ...newTask.gradingRules, textIncludes: v },
                  })} />

              <Input label="Forbidden Tags"
                value={newTask.gradingRules.forbiddenTags}
                onChange={(v) =>
                  setNewTask({
                    ...newTask,
                    gradingRules: { ...newTask.gradingRules, forbiddenTags: v },
                  })} />
            </>
          )}

          <Input label="XP Reward" type="number" value={newTask.xp}
            onChange={(v) => setNewTask({ ...newTask, xp: v })} />

          <button
            onClick={addTask}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold"
          >
            Add Task
          </button>
        </div>

        {/* EXISTING */}
        <h3 className="text-xl font-semibold mb-4">Existing Tasks</h3>
        {tasks.map((t, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border mb-3">
            <b>{t.type.toUpperCase()}</b> — ⭐ {t.xp} XP
            {t.codingPrompt && <p>{t.codingPrompt}</p>}
            {t.question && <p>{t.question}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== UI HELPERS ===== */
const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-3">
    <label className="text-sm text-gray-700">{label}</label>
    <input type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg" />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="text-sm text-gray-700">{label}</label>
    <textarea rows={4} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg" />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-700">{label}</label>
    <select value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg">
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
