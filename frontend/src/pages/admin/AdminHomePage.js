import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Layers, Share2, Users } from "lucide-react";

function AdminHomePage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create a Module",
      subtitle: "Design new learning tracks",
      description: "Draft a fresh module shell and start building quests instantly.",
      to: "/admin/create-module",
      icon: <Layers className="h-5 w-5" />,
      accent: "from-indigo-100 via-white to-violet-50",
    },
    {
      title: "Assign a Trainer",
      subtitle: "Match people to modules",
      description: "Use the improved matching board to assign the right mentor quickly.",
      to: "/admin/assign",
      icon: <Share2 className="h-5 w-5" />,
      accent: "from-rose-100 via-white to-orange-50",
    },
    {
      title: "Manage People",
      subtitle: "Control admin and trainer access",
      description: "Search users and verify role coverage before launching programs.",
      to: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      accent: "from-sky-100 via-white to-cyan-50",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-glow-card rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Overview</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Choose your next command</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          The control center lives on this page only. Pick an action below to jump straight into execution.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            type="button"
            key={card.title}
            onClick={() => navigate(card.to)}
            className={`admin-glow-card admin-shimmer group rounded-3xl border border-slate-100 bg-gradient-to-br ${card.accent} p-6 text-left shadow-sm transition hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between text-slate-600">
              <span className="rounded-xl bg-white p-2 text-indigo-500 shadow-sm">{card.icon}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">{card.subtitle}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

export default AdminHomePage;