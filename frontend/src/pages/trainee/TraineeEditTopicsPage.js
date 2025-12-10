import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TraineeEditTopicsPage = () => {
  const { moduleId } = useParams();
  const { token } = useAuth();
  const [moduleData, setModuleData] = useState(null);
  const [newTopic, setNewTopic] = useState("");

  // Fetch module
  useEffect(() => {
    fetch(`http://localhost:5000/api/trainee/module/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setModuleData);
  }, [moduleId, token]);

  // Add topic
  const addTopic = async () => {
    if (!newTopic) return;
    const res = await fetch(
      `http://localhost:5000/api/trainee/module/${moduleId}/topic`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTopic }),
      }
    );

    const data = await res.json();
    setModuleData(data.module);
    setNewTopic("");
  };

  if (!moduleData) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="text-white p-10">
      <h2 className="text-3xl font-bold mb-6">{moduleData.title}</h2>

      {/* Add Topic input */}
      <div className="flex gap-3 mb-5">
        <input
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          placeholder="New topic name"
          className="px-4 py-2 rounded bg-gray-800 w-80"
        />
        <button
          onClick={addTopic}
          className="px-4 py-2 bg-purple-600 rounded"
        >
          + Add Topic
        </button>
      </div>

      {/* Topics list */}
      {moduleData.topics.map((t, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-900 rounded">
          <h3 className="font-semibold text-xl mb-2">{t.title}</h3>
          <p>Levels: {t.levels.length}</p>

          <button
            className="mt-3 px-4 py-2 bg-blue-600 rounded"
            onClick={() =>
              alert("Next step — Add Levels UI (STEP 3)")
            }
          >
            Add Levels
          </button>
        </div>
      ))}
    </div>
  );
};

export default TraineeEditTopicsPage;
