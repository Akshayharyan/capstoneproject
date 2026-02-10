import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AssignModulePage() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  /* ===== FETCH USERS ===== */
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, [token]);

  /* ===== FETCH MODULES ===== */
  useEffect(() => {
    fetch("http://localhost:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setModules(data.modules || []));
  }, [token]);

  /* ===== ASSIGN ===== */
  const handleAssign = async () => {
    if (!selectedTrainer || !selectedModule) {
      alert("Select module and trainer first");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/admin/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trainerId: selectedTrainer,
        moduleId: selectedModule,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.message || "Assignment failed");

    alert("🎉 Module assigned successfully");
    setSelectedTrainer(null);
    setSelectedModule(null);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-900">Assign Trainer</h1>
        <p className="text-gray-500">Assign trainers to manage modules</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* MODULES */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Module</h3>

          <div className="space-y-3">
            {modules.map(m => (
              <div
                key={m._id}
                onClick={() => setSelectedModule(m._id)}
                className={`p-4 rounded-xl cursor-pointer border shadow-sm transition
                  ${
                    selectedModule === m._id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
              >
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-gray-500">
                  {m.description || "No trainer assigned"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TRAINERS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Trainer</h3>

          <div className="space-y-3">
            {users
              .filter(u => u.role === "trainer")
              .map(u => (
                <div
                  key={u._id}
                  onClick={() => setSelectedTrainer(u._id)}
                  className={`p-4 rounded-xl cursor-pointer border shadow-sm transition flex items-center gap-3
                    ${
                      selectedTrainer === u._id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* ASSIGN BUTTON */}
      <button
        onClick={handleAssign}
        disabled={loading}
        className={`px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-md transition
          ${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95"
          }`}
      >
        {loading ? "Assigning..." : "Assign Trainer →"}
      </button>

    </div>
  );
}

export default AssignModulePage;