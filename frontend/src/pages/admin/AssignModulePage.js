import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AssignModulePage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]); // MUST be array
  const [form, setForm] = useState({ trainee: "", module: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setModules(Array.isArray(data) ? data : data.modules || []);
      });
  }, [token]);

  const handleAssign = async () => {
    await fetch("http://localhost:5000/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    alert("Module Assigned 🎉");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-300 mb-6">Assign Module</h2>

      <select
        className="p-3 bg-gray-700 rounded text-white mb-4"
        onChange={(e) => setForm({ ...form, trainee: e.target.value })}
      >
        <option>Select Trainee</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      <select
        className="p-3 bg-gray-700 rounded text-white mb-4"
        onChange={(e) => setForm({ ...form, module: e.target.value })}
      >
        <option>Select Module</option>
        {modules?.length > 0 ? (
          modules.map((m) => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))
        ) : (
          <option disabled>No modules available</option>
        )}
      </select>

      <button
        onClick={handleAssign}
        className="bg-purple-500 hover:bg-purple-600 p-3 rounded font-bold text-white"
      >
        Assign
      </button>
    </div>
  );
}

export default AssignModulePage;
