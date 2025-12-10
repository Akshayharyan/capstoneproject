import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function CreateModulePage() {
  const { token } = useAuth();
  const [form, setForm] = useState({ title: "", description: "" });

  const handleCreate = async () => {
    if (!form.title) return alert("Module title is required");

    await fetch("http://localhost:5000/api/modules/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    alert("Module Created 🎉");
    setForm({ title: "", description: "" });
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold text-purple-300 mb-6">Create Module</h2>

      <input
        className="w-full p-3 bg-gray-700 rounded text-white mb-4"
        placeholder="Module Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full p-3 bg-gray-700 rounded text-white mb-4"
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        onClick={handleCreate}
        className="w-full bg-purple-500 hover:bg-purple-600 p-3 rounded font-bold text-white"
      >
        Create Module
      </button>
    </div>
  );
}

export default CreateModulePage;
