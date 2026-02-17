import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TrainerEditTopicsPage() {
  const { moduleId } = useParams();
  const { token } = useAuth();

  const [moduleData, setModuleData] = useState(null);
  const [bosses, setBosses] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState("");

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
      .then((data) => {
        setModuleData(data);
        if (data.boss?._id) setSelectedBoss(data.boss._id);
      })
      .catch(console.error);
  }, [moduleId, token]);

  /* ================= FETCH BOSSES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/bosses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBosses)
      .catch(console.error);
  }, [token]);

  /* ================= ASSIGN BOSS ================= */
  const assignBoss = async () => {
    if (!selectedBoss) return alert("Select a boss first!");

    const res = await fetch(
      `http://localhost:5000/api/trainer/module/${moduleId}/assign-boss`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bossId: selectedBoss }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setModuleData(data.module);
      alert("🐲 Boss assigned successfully!");
    } else {
      alert(data.message || "Failed to assign boss");
    }
  };

  /* ================= ADD TOPIC ================= */
  const addTopic = async () => {
    if (!newTopic.title.trim() || !newTopic.videoUrl.trim()) {
      return alert("Title & Video URL required");
    }

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

    if (!res.ok) return alert(data.message);

    setModuleData(data.module);
    setNewTopic({ title: "", videoUrl: "", xp: "" });
  };

  if (!moduleData) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 min-h-screen bg-[#f7f8fc] space-y-10">

      <h1 className="text-4xl font-extrabold text-orange-500">
        Edit Module
      </h1>

      {/* ================= BOSS SECTION ================= */}
      <div className="bg-white rounded-2xl p-6 shadow border space-y-4">

        <h2 className="text-2xl font-bold text-gray-800">
          🐲 Final Boss Battle
        </h2>

        <select
          value={selectedBoss}
          onChange={(e) => setSelectedBoss(e.target.value)}
          className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select Boss</option>
          {bosses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name} — {b.difficulty}
            </option>
          ))}
        </select>

        <button
          onClick={assignBoss}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition"
        >
          Assign Boss
        </button>

        {moduleData.boss && (
          <div className="mt-6 bg-purple-50 border rounded-xl p-4 flex gap-4 items-center">
            <img
              src={moduleData.boss.image}
              alt="boss"
              className="w-32 rounded-lg shadow"
            />
            <div>
              <p className="text-purple-700 font-bold text-lg">
                {moduleData.boss.name}
              </p>
              <p className="text-sm text-gray-600">
                Difficulty: {moduleData.boss.difficulty}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ================= TOPIC SECTION ================= */}
      <div className="bg-white rounded-2xl p-6 shadow border space-y-4">

        <h2 className="text-2xl font-bold text-gray-800">
          📚 Add Learning Topic
        </h2>

        <input
          placeholder="Topic title"
          value={newTopic.title}
          onChange={(e) =>
            setNewTopic({ ...newTopic, title: e.target.value })
          }
          className="w-full p-3 border rounded-lg text-gray-900"
        />

        <input
          placeholder="Video URL"
          value={newTopic.videoUrl}
          onChange={(e) =>
            setNewTopic({ ...newTopic, videoUrl: e.target.value })
          }
          className="w-full p-3 border rounded-lg text-gray-900"
        />

        <input
          type="number"
          placeholder="XP reward"
          value={newTopic.xp}
          onChange={(e) =>
            setNewTopic({ ...newTopic, xp: e.target.value })
          }
          className="w-full p-3 border rounded-lg text-gray-900"
        />

        <button
          onClick={addTopic}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition"
        >
          Add Topic
        </button>
      </div>

    </div>
  );
}
