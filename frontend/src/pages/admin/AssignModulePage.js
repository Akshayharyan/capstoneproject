import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AssignModulePage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ trainer: "", module: "" });

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, [token]);

  // Fetch modules
  useEffect(() => {
    fetch("http://localhost:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModules(Array.isArray(data) ? data : data.modules || []));
  }, [token]);

  const handleAssign = async () => {
    if (!form.trainer || !form.module) {
      alert("Please select trainer and module");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.status === 409) {
      alert("⚠ Module already assigned to this trainer");
      return;
    }

    if (!data.success) {
      alert("❌ Failed to assign module");
      return;
    }

    alert("🎉 Module Assigned Successfully!");
    setForm({ trainer: "", module: "" });
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold text-purple-300 mb-6">Assign Module</h2>

      {/* Trainer select */}
      <select
        className="p-3 bg-gray-700 rounded text-white mb-4 w-full"
        value={form.trainer}
        onChange={(e) => setForm({ ...form, trainer: e.target.value })}
      >
        <option value="">Select Trainer</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      {/* Module select */}
      <select
        className="p-3 bg-gray-700 rounded text-white mb-4 w-full"
        value={form.module}
        onChange={(e) => setForm({ ...form, module: e.target.value })}
      >
        <option value="">Select Module</option>
        {modules?.length > 0 ? (
          modules.map((m) => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))
        ) : (
          <option disabled>No modules available</option>
        )}
      </select>

      {/* Button */}
      <button
        onClick={handleAssign}
        disabled={loading}
        className={`p-3 rounded font-bold text-white w-full ${
          loading ? "bg-gray-600" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Assigning..." : "Assign Module"}
      </button>
    </div>
  );
}

export default AssignModulePage;
