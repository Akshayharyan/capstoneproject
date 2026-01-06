// frontend/src/pages/trainer/TrainerEditTopicsPage.js
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
    xp: 0,
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
    setNewTopic({ title: "", videoUrl: "", xp: 0 });
  };

  if (!moduleData) {
    return <p className="text-white p-10">Loading...</p>;
  }

  return (
    <div className="p-10 text-white">
      <h2 className="text-3xl font-bold mb-6">
        ✏️ Edit Module: {moduleData.title}
      </h2>

      {/* ADD TOPIC */}
      <div className="bg-gray-900 p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">➕ Add New Topic</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Topic Title"
            value={newTopic.title}
            onChange={(e) =>
              setNewTopic({ ...newTopic, title: e.target.value })
            }
            className="px-4 py-2 rounded bg-gray-800"
          />

          <input
            placeholder="Video URL (YouTube Embed)"
            value={newTopic.videoUrl}
            onChange={(e) =>
              setNewTopic({ ...newTopic, videoUrl: e.target.value })
            }
            className="px-4 py-2 rounded bg-gray-800"
          />

          <input
            type="number"
            placeholder="XP"
            value={newTopic.xp}
            onChange={(e) =>
              setNewTopic({ ...newTopic, xp: e.target.value })
            }
            className="px-4 py-2 rounded bg-gray-800"
          />
        </div>

        <button
          type="button"
          onClick={addTopic}
          className="mt-5 px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700"
        >
          ✅ Add Topic
        </button>
      </div>

      {/* TOPICS LIST */}
      <div className="space-y-6">
        {moduleData.topics.map((t, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{t.title}</h3>
                <p className="text-gray-400 text-sm">
                  🎥 Video | 🧪 Tasks: {t.tasks?.length || 0} | ⭐ XP: {t.xp}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/trainer/modules/${moduleId}/topic/${index}/tasks`
                  )
                }
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                🧪 Manage Tasks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
