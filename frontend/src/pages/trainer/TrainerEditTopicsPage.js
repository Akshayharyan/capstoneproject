import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TrainerEditTopicsPage() {
  const { moduleId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: "",
    videoUrl: "",
    xp: "",
  });

  /* ================= FETCH MODULE ================= */
  useEffect(() => {
    fetch(`http://localhost:5000/api/trainer/module/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setModuleData)
      .catch(console.error);
  }, [moduleId, token]);

  /* ================= ADD TOPIC ================= */
  const addTopic = async () => {
    const title = newTopic.title.trim();
    const videoUrl = newTopic.videoUrl.trim();
    const xp = Number(newTopic.xp) || 0;

    if (!title || !videoUrl) {
      alert("Title and valid Video URL are required");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/trainer/module/${moduleId}/topic`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, videoUrl, xp }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to add topic");
      return;
    }

    setModuleData(data.module);
    setNewTopic({ title: "", videoUrl: "", xp: "" });
  };

  if (!moduleData) {
    return <p className="p-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-10 min-h-screen bg-[#f7f8fc]">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-orange-500">
          Edit Topics
        </h1>
        <p className="text-gray-600 mt-1">
          Module: <span className="font-semibold">{moduleData.title}</span>
        </p>
      </div>

      {/* ADD TOPIC CARD */}
      <div className="bg-white rounded-xl p-6 mb-10 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Topic
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* TITLE */}
          <input
            placeholder="Topic title"
            value={newTopic.title}
            onChange={(e) =>
              setNewTopic({ ...newTopic, title: e.target.value })
            }
            className="px-4 py-2 rounded-lg border border-gray-300
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* VIDEO URL */}
          <input
            placeholder="YouTube embed URL"
            value={newTopic.videoUrl}
            onChange={(e) =>
              setNewTopic({ ...newTopic, videoUrl: e.target.value })
            }
            className="px-4 py-2 rounded-lg border border-gray-300
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* XP */}
          <input
            type="number"
            placeholder="XP"
            value={newTopic.xp}
            onChange={(e) =>
              setNewTopic({ ...newTopic, xp: e.target.value })
            }
            className="px-4 py-2 rounded-lg border border-gray-300
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <button
          type="button"
          onClick={addTopic}
          className="mt-5 px-6 py-2 rounded-lg
                     bg-orange-500 hover:bg-orange-400
                     text-white font-semibold transition"
        >
          Add Topic
        </button>
      </div>

      {/* TOPICS LIST */}
      <div className="space-y-4">
        {moduleData.topics.map((t, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 flex justify-between items-center
                       border border-gray-200 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {index + 1}. {t.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                🎥 Video · 🧪 Tasks: {t.tasks?.length || 0} · ⭐ XP: {t.xp}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/trainer/modules/${moduleId}/topic/${index}/tasks`
                )
              }
              className="px-4 py-2 rounded-lg
                         border border-indigo-500
                         text-indigo-600
                         hover:bg-indigo-50
                         transition"
            >
              Manage Tasks
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
