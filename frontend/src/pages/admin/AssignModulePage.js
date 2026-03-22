import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Layers, Users as UsersIcon, Share2 } from "lucide-react";

function AssignModulePage() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Users load failed:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setModules(data.modules || []))
      .catch((err) => console.error("Modules load failed:", err));
  }, [token]);

  const trainers = useMemo(() => users.filter((u) => u.role === "trainer"), [users]);

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

  const overviewStats = [
    {
      label: "Modules",
      value: modules.length,
      helper: "Ready for guidance",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      label: "Trainers",
      value: trainers.length,
      helper: "Eligible mentors",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      label: "Selection",
      value: selectedModule && selectedTrainer ? "Locked" : "Pending",
      helper: "Choose module + trainer",
      icon: <Share2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Pairing</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Assign Trainers</h1>
        <p className="text-slate-500">Connect trainers with modules that match their craft.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between text-slate-500">
              <p className="text-xs uppercase tracking-[0.4em]">{stat.label}</p>
              <span className="rounded-xl bg-indigo-50 p-2 text-indigo-500">{stat.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Select Module</h3>
          <p className="text-sm text-slate-500">Choose the experience that needs a trainer.</p>

          <div className="mt-4 space-y-3">
            {modules.map((m) => (
              <button
                type="button"
                key={m._id}
                onClick={() => setSelectedModule(m._id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  selectedModule === m._id
                    ? "border-indigo-400 bg-indigo-50 shadow"
                    : "border-slate-100 bg-slate-50 hover:border-indigo-200"
                }`}
              >
                <p className="font-semibold text-slate-900">{m.title}</p>
                <p className="text-sm text-slate-500">
                  {m.description || "Awaiting description"}
                </p>
              </button>
            ))}
            {modules.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No modules available yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Select Trainer</h3>
          <p className="text-sm text-slate-500">Only profiles with trainer role are listed.</p>

          <div className="mt-4 space-y-3">
            {trainers.map((u) => (
              <button
                type="button"
                key={u._id}
                onClick={() => setSelectedTrainer(u._id)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  selectedTrainer === u._id
                    ? "border-emerald-400 bg-emerald-50 shadow"
                    : "border-slate-100 bg-slate-50 hover:border-emerald-200"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600">
                  {u.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>
              </button>
            ))}
            {trainers.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                Promote a user to trainer to assign modules.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Summary</p>
          <p className="text-sm text-slate-600">
            {selectedModule && selectedTrainer
              ? "All set—deploy the assignment."
              : "Pick a module and trainer to continue."}
          </p>
        </div>
        <button
          onClick={handleAssign}
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Assigning…" : "Assign Trainer"}
        </button>
      </div>
    </div>
  );
}

export default AssignModulePage;