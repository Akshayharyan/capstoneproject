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

    // Optional: you can add backend delete later
  };

  /* ================= EDIT TOPIC ================= */

  const saveEdit = () => {
    setEditingIndex(null);
    // Optional: add backend PUT later
  };

  if (loading)
    return <p className="p-10 text-gray-500">Loading module...</p>;

  return (
    <div className="p-10 min-h-screen bg-[#f7f8fc] space-y-10">

      <div>
        <h1 className="text-4xl font-extrabold text-orange-500">
          Manage Topics
        </h1>
        <p className="text-gray-600 mt-2">
          {moduleData.topics.length} topics in this module
        </p>
      </div>

      {/* ================= ADD TOPIC ================= */}

      <div className="bg-white rounded-2xl p-6 shadow border space-y-4 max-w-xl">

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
          className="bg-orange-500 hover:bg-orange-600
                     text-white font-bold px-6 py-3 rounded-lg w-full"
        >
          {adding ? "Adding..." : "Add Topic"}
        </button>
      </div>

      {/* ================= TOPIC LIST ================= */}

      <div className="space-y-4">

        {moduleData.topics.length === 0 && (
          <div className="bg-white p-6 rounded-xl border text-gray-500 text-center">
            No topics yet. Start by creating one above.
          </div>
        )}

        {moduleData.topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center"
          >
            {editingIndex === index ? (
              <div className="flex-1 space-y-2">
                <input
                  className="w-full p-2 border rounded"
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
                  <h3 className="font-bold text-gray-800">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    XP: {topic.xp}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTopic(index)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/trainer/modules/${moduleId}/topic/${index}/tasks`
                      )
                    }
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Manage Tasks →
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