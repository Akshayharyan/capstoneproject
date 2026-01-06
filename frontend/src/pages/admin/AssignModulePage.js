import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AssignModulePage() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    trainer: "",
    module: "",
  });

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("👤 Users fetched:", data);
        setUsers(Array.isArray(data) ? data : []);
      });
  }, [token]);

  /* ================= FETCH MODULES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw modules response:", data);
        console.log("📦 Modules list:", data.modules);
        setModules(data.modules || []);
      });
  }, [token]);

  /* ================= ASSIGN ================= */
  const handleAssign = async () => {
    console.log("🧾 Selected form state:", form);

    if (!form.trainer || !form.module) {
      alert("Please select trainer and module");
      return;
    }

    setLoading(true);

    const payload = {
      trainerId: form.trainer,
      moduleId: form.module,
    };

    console.log("📩 Sending payload:", payload);

    const res = await fetch("http://localhost:5000/api/admin/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    console.log("📨 Server response:", data);

    if (!res.ok) {
      alert(data.message || "Assignment failed");
      return;
    }

    alert("🎉 Module assigned successfully");
    setForm({ trainer: "", module: "" });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold text-purple-300 mb-6">
        Assign Module
      </h2>

      {/* TRAINER */}
      <select
        className="p-3 bg-gray-700 rounded text-white mb-4 w-full"
        value={form.trainer}
        onChange={(e) =>
          setForm({ ...form, trainer: e.target.value })
        }
      >
        <option value="">Select Trainer</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* MODULE */}
      <select
        className="p-3 bg-gray-700 rounded text-white mb-4 w-full"
        value={form.module}
        onChange={(e) =>
          setForm({ ...form, module: e.target.value })
        }
      >
        <option value="">Select Module</option>

        {modules.map((m) => (
          <option
            key={m._id}
            value={m._id}   // 🔥 THIS MUST BE _id
          >
            {m.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        disabled={loading}
        className={`p-3 rounded font-bold text-white w-full ${
          loading
            ? "bg-gray-600"
            : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? "Assigning..." : "Assign Module"}
      </button>
    </div>
  );
}

export default AssignModulePage;
