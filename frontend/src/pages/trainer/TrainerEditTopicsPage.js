import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TrainerEditTopicsPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newTopic, setNewTopic] = useState({
    title: "",
    videoUrl: "",
    xp: "",
  });

  /* ================= LOAD MODULE ================= */

  const loadModule = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/trainer/module/${moduleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (data?.success) {
        setModuleData({
          ...data.module,
          topics: Array.isArray(data.module.topics)
            ? data.module.topics
            : [],
        });
      }
    } catch (err) {
      console.error("Load module failed:", err);
    } finally {
      setLoading(false);
    }
  }, [moduleId, token]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  /* ================= ADD TOPIC ================= */

  const addTopic = async () => {
    if (!newTopic.title.trim() || !newTopic.videoUrl.trim())
      return alert("Title & Video URL required");

    setAdding(true);

    const res = await fetch(
      `http://localhost:5000/api/trainer/module/${moduleId}/topic`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTopic.title,
          videoUrl: newTopic.videoUrl,
          xp: Number(newTopic.xp) || 0,
        }),
      }
    );

    const data = await res.json();

    if (data?.success) {
      setModuleData({
        ...data.module,
        topics: data.module.topics || [],
      });

      setNewTopic({ title: "", videoUrl: "", xp: "" });
    }

    setAdding(false);
  };

  /* ================= DELETE TOPIC ================= */

  const deleteTopic = async (index) => {
    if (!window.confirm("Delete this topic?")) return;

    const updated = [...moduleData.topics];
    updated.splice(index, 1);
    setModuleData({ ...moduleData, topics: updated });
  };

  /* ================= EDIT TOPIC ================= */

  const saveEdit = () => {
    setEditingIndex(null);
  };

  if (loading)
    return <p className="p-12 text-gray-500">Loading module...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 px-12 py-14 space-y-14 max-w-6xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {moduleData.title}
          </h1>
          <p className="text-gray-500 mt-2">
            {moduleData.topics.length} Topics •{" "}
            {moduleData.topics.reduce((sum, t) => sum + (t.xp || 0), 0)} XP
          </p>
        </div>

        <button
          onClick={() => navigate("/trainer")}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition"
        >
          Back
        </button>

      </div>

      {/* ================= ADD TOPIC CARD ================= */}

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4 max-w-xl">

        <h2 className="text-lg font-semibold text-gray-900">
          Create New Topic
        </h2>

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Topic title"
          value={newTopic.title}
          onChange={(e) =>
            setNewTopic({ ...newTopic, title: e.target.value })
          }
        />

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="YouTube Video URL"
          value={newTopic.videoUrl}
          onChange={(e) =>
            setNewTopic({ ...newTopic, videoUrl: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full p-3 border rounded-lg"
          placeholder="XP reward"
          value={newTopic.xp}
          onChange={(e) =>
            setNewTopic({ ...newTopic, xp: e.target.value })
          }
        />

        <button
          disabled={adding}
          onClick={addTopic}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl w-full transition"
        >
          {adding ? "Adding..." : "Add Topic"}
        </button>

      </div>

      {/* ================= TOPIC LIST ================= */}

      <div className="space-y-6">

        {moduleData.topics.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-gray-500 text-center shadow-sm">
            No topics yet. Create your first one above.
          </div>
        )}

        {moduleData.topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
          >

            {editingIndex === index ? (
              <div className="flex-1 space-y-3">
                <input
                  className="w-full p-2 border rounded-lg"
                  value={topic.title}
                  onChange={(e) => {
                    const updated = [...moduleData.topics];
                    updated[index].title = e.target.value;
                    setModuleData({ ...moduleData, topics: updated });
                  }}
                />
                <button
                  onClick={saveEdit}
                  className="text-green-600 text-sm font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    XP: {topic.xp}
                  </p>
                </div>

                <div className="flex gap-6 items-center">

                  <button
                    onClick={() => setEditingIndex(index)}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTopic(index)}
                    className="text-red-500 text-sm font-medium hover:underline"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/trainer/modules/${moduleId}/topic/${index}/tasks`
                      )
                    }
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Manage Tasks
                  </button>

                </div>
              </>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}