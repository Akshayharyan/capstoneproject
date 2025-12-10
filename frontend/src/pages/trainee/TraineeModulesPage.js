import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TraineeModulesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trainee/assigned", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModules(data));
  }, [token]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-300 mb-6">My Modules</h2>

      {modules.length === 0 && (
        <p className="text-gray-400">No modules assigned yet.</p>
      )}

      {modules.map((m) => (
        <div key={m.assignmentId} className="bg-gray-800 p-5 rounded-lg mb-4">
          <h3 className="text-xl font-bold">{m.title}</h3>
          <p className="text-gray-400">{m.description}</p>
          <p className="mt-2">Topics: {m.topicsCount}</p>

          <button
            onClick={() => navigate(`/trainee/modules/${m.moduleId}/edit`)}
            className="mt-3 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Edit Topics
          </button>
        </div>
      ))}
    </div>
  );
}

export default TraineeModulesPage;
