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

  /* ===== Markdown Editor Config (STABLE) ===== */
  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder: "Write the learning content for this level...",
      autofocus: false,
      status: ["lines", "words"],
    }),
    []
  );

  const handleMarkdownChange = useCallback((value) => {
    setContentMarkdown(value);
  }, []);

  /* ===== CREATE LEVEL ===== */
  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a level title");
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
    <div
      className="p-10 min-h-screen"
      style={{ backgroundColor: "var(--bg-app)" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-orange-500">
          Create Level
        </h1>
        <p className="text-gray-600 mt-1">
          Add learning content to this topic
        </p>
      </div>

      {/* Form Card */}
      <div
        className="max-w-4xl bg-white rounded-2xl p-8"
        style={{
          boxShadow: "var(--shadow-soft)",
          border: "1px solid var(--border-light)",
        }}
      >
        {/* Level Title */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Level Title
        </label>
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Understanding JSX Syntax"
        />

        {/* Markdown Editor */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Content
        </label>

        <div
          className="rounded-lg overflow-hidden mb-6"
          style={{
            border: "1px solid var(--border-light)",
          }}
        >
          <SimpleMDE
            value={contentMarkdown}
            onChange={handleMarkdownChange}
            options={editorOptions}
          />
        </div>

        {/* XP */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          XP Reward
        </label>
        <input
          type="number"
          className="w-32 px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-orange-400 mb-8"
          value={xp}
          onChange={(e) => setXp(e.target.value)}
          min={0}
        />

        {/* Action */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-6 py-3 rounded-lg
                     bg-orange-500 hover:bg-orange-400
                     text-white font-semibold
                     transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Level & Add Tasks"}
        </button>
      </div>
    </div>
  );
}
