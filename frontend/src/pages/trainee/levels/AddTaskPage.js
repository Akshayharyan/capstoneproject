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

  // quiz fields
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [quizXp, setQuizXp] = useState(5);

  // coding fields
  const [codingPrompt, setCodingPrompt] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState('[{ "input": "", "output": "" }]');
  const [codingXp, setCodingXp] = useState(10);

  // fetch tasks
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
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  const addCodingTask = async () => {
    if (!codingPrompt) return alert("Prompt required");

    let parsedTests = [];
    try {
      parsedTests = JSON.parse(testCases);
    } catch (e) {
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
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  const handleDelete = async (taskIdx) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level/${levelIndex}/task/${taskIdx}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    }
  };

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-4">Manage Tasks (Level {Number(levelIndex) + 1})</h2>

      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Task Type</label>
        <select className="p-2 rounded bg-gray-800" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          <option value="quiz">Quiz</option>
          <option value="coding">Coding</option>
        </select>
      </div>

      {taskType === "quiz" && (
        <div className="bg-gray-900 p-4 rounded mb-6">
          <label className="text-gray-300">Question</label>
          <input className="w-full p-2 rounded bg-gray-800 mb-2" value={question} onChange={(e) => setQuestion(e.target.value)} />

          <label className="text-gray-300">Options</label>
          {options.map((o, i) => (
            <input key={i} className="w-full p-2 rounded bg-gray-800 mb-2" value={o} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
          ))}

          <label className="text-gray-300">Correct Option Index (0-3)</label>
          <input type="number" min="0" max="3" className="p-2 rounded bg-gray-800 mb-2" value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)} />

          <label className="text-gray-300">XP for this task</label>
          <input className="w-32 p-2 rounded bg-gray-800 mb-3" value={quizXp} onChange={(e) => setQuizXp(e.target.value)} />

          <button className="px-4 py-2 bg-green-600 rounded" onClick={addQuizTask}>Add Quiz Question</button>
        </div>
      )}

      {taskType === "coding" && (
        <div className="bg-gray-900 p-4 rounded mb-6">
          <label className="text-gray-300">Coding Prompt</label>
          <textarea className="w-full p-2 rounded bg-gray-800 mb-2" value={codingPrompt} onChange={(e) => setCodingPrompt(e.target.value)} />

          <label className="text-gray-300">Starter Code</label>
          <textarea className="w-full p-2 rounded bg-gray-800 mb-2" value={starterCode} onChange={(e) => setStarterCode(e.target.value)} rows={6} />

          <label className="text-gray-300">Test Cases (JSON array)</label>
          <textarea className="w-full p-2 rounded bg-gray-800 mb-2" value={testCases} onChange={(e) => setTestCases(e.target.value)} rows={6} />

          <label className="text-gray-300">XP for this task</label>
          <input className="w-32 p-2 rounded bg-gray-800 mb-3" value={codingXp} onChange={(e) => setCodingXp(e.target.value)} />

          <button className="px-4 py-2 bg-green-600 rounded" onClick={addCodingTask}>Add Coding Task</button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-3">Existing Tasks</h3>
      {tasks.length === 0 && <p className="text-gray-400">No tasks yet.</p>}
      {tasks.map((t, i) => (
        <div key={i} className="bg-gray-800 p-3 rounded mb-3">
          <div className="flex justify-between">
            <div>
              <strong>{t.type.toUpperCase()}</strong> — {t.question ? t.question : t.codingPrompt?.slice(0, 80) || "Task"}
              <div className="text-sm text-gray-400">XP: {t.xp || 0}</div>
            </div>
            <div>
              <button onClick={() => handleDelete(i)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 rounded mr-3" onClick={() => navigate(-1)}>Back</button>
        <button className="px-4 py-2 bg-purple-600 rounded" onClick={() => alert("Preview / Publish flow can be added later")}>Done</button>
      </div>
    </div>
  );
}
