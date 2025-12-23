import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function CreateLevelPage() {
  const { moduleId, topicIndex } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [xp, setXp] = useState(10);
  const [loading, setLoading] = useState(false);

  // 🔐 FIX: memoize options so editor is NOT recreated
  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder: "Write learning content here...",
      autofocus: true,
      status: ["lines", "words", "cursor"],
    }),
    []
  );

  // 🔐 FIX: stable onChange reference
  const handleMarkdownChange = useCallback((value) => {
    setContentMarkdown(value);
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}/topic/${topicIndex}/level`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            contentMarkdown,
            xp: Number(xp),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      const { levelIndex } = data;

      alert("Level created. Now add tasks.");
      navigate(
        `/trainer/modules/${moduleId}/topics/${topicIndex}/levels/${levelIndex}/tasks`
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Create Level</h2>

      <label className="block text-gray-300 mb-1">Level Title</label>
      <input
        className="w-full p-2 rounded bg-gray-800 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Introduction to HTML"
      />

      <label className="block text-gray-300 mb-2">Learning Content</label>
      <div className="bg-white text-black rounded">
        <SimpleMDE
          value={contentMarkdown}
          onChange={handleMarkdownChange}
          options={editorOptions}
        />
      </div>

      <label className="block mt-4 text-gray-300">XP Reward</label>
      <input
        type="number"
        className="w-32 p-2 rounded bg-gray-800"
        value={xp}
        onChange={(e) => setXp(e.target.value)}
        min={0}
      />

      <div className="mt-6">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Level & Add Tasks"}
        </button>
      </div>
    </div>
  );
}
