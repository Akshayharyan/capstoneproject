// frontend/src/pages/trainee/TraineeEditTopicsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TraineeEditTopicsPage() {
  const { moduleId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/trainee/module/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModuleData(data))
      .catch((err) => console.error(err));
  }, [moduleId, token]);

  const addTopic = async () => {
    if (!newTopic) return alert("Title required");
    const res = await fetch(`http://localhost:5000/api/trainee/module/${moduleId}/topic`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTopic }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed to add topic");
    setModuleData(data.module);
    setNewTopic("");
  };

  if (!moduleData) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="text-white p-10">
      <h2 className="text-3xl font-bold mb-6">{moduleData.title}</h2>

      <div className="flex gap-3 mb-5">
        <input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="New topic name" className="px-4 py-2 rounded bg-gray-800 w-80" />
        <button onClick={addTopic} className="px-4 py-2 bg-purple-600 rounded">+ Add Topic</button>
      </div>

      {moduleData.topics.map((t, topicIndex) => (
        <div key={topicIndex} className="mb-6 p-4 bg-gray-900 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-xl mb-2">{t.title}</h3>
              <p className="text-gray-400">Levels: {t.levels.length}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/trainee/modules/${moduleId}/topics/${topicIndex}/create-level`)} className="px-3 py-2 bg-green-600 rounded">+ Add Level</button>
            </div>
          </div>

          {/* list levels */}
          <div className="mt-4 space-y-3">
            {t.levels.map((lv, li) => (
              <div key={li} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">Level {lv.number}: {lv.title}</div>
                  <div className="text-sm text-gray-400">XP: {lv.xp || 0} — Tasks: {(lv.tasks && lv.tasks.length) || 0}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/trainee/modules/${moduleId}/topics/${topicIndex}/levels/${li}/tasks`)} className="px-3 py-2 bg-blue-600 rounded">Manage Tasks</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
