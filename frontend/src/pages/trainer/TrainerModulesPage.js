// frontend/src/pages/trainer/TrainerModulesPage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TrainerModulesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trainer/assigned", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="p-10 text-white">
      <h2 className="text-3xl font-bold text-purple-300 mb-6">
        📘 My Assigned Modules
      </h2>

      {modules.length === 0 && (
        <p className="text-gray-400">No modules assigned yet.</p>
      )}

      <div className="space-y-5">
        {modules.map((m) => (
          <div
            key={m.assignmentId}
            className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition"
          >
            <h3 className="text-xl font-bold">{m.title}</h3>
            <p className="text-gray-400 mb-2">{m.description}</p>
            <p className="text-sm text-gray-500">
              Topics: {m.topicsCount}
            </p>

            <button
              onClick={() =>
                navigate(`/trainer/modules/${m.moduleId}/edit`)
              }
              className="mt-4 px-5 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              ✏️ Edit Topics & Content
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerModulesPage;
