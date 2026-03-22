import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Layers,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Share2,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [monitoringSnapshot, setMonitoringSnapshot] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/users", label: "People", icon: Users },
    { to: "/admin/create-module", label: "Create Module", icon: Layers },
    { to: "/admin/assign", label: "Assign Trainer", icon: Share2 },
    {
      to: "/admin/employee-monitoring",
      label: "Employee Monitoring",
      icon: Activity,
    },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const actionCards = useMemo(
    () => [
    {
      title: "Compose Module",
      description: "Blueprint lessons, quests, and boss fights from scratch.",
      to: "/admin/create-module",
      accent: "from-sky-100 via-white to-cyan-50",
    },
    {
      title: "Assign Talent",
      description: "Pair teams with the right trainer for upcoming sprints.",
      to: "/admin/assign",
      accent: "from-rose-100 via-white to-orange-50",
    },
    {
      title: "Performance Radar",
      description: "Monitor progress heatmaps before they cool off.",
      to: "/admin/employee-monitoring",
      accent: "from-indigo-100 via-white to-violet-50",
    },
    ],
    []
  );

  useEffect(() => {
    let active = true;

    const loadOverview = async () => {
      if (!token) return;

      setLoadingOverview(true);
      try {
        const [analyticsRes, monitoringRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/employee-monitoring", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const analyticsData = await analyticsRes.json();
        const monitoringData = await monitoringRes.json();

        if (!analyticsRes.ok) {
          throw new Error(analyticsData.message || "Failed to load analytics");
        }

        if (!monitoringRes.ok) {
          throw new Error(monitoringData.message || "Failed to load monitoring");
        }

        if (!active) return;

        const employees = Array.isArray(monitoringData.employees)
          ? monitoringData.employees
          : [];

        const avgProgress =
          employees.length === 0
            ? 0
            : Math.round(
                employees.reduce(
                  (sum, emp) => sum + (emp.progressPercent || 0),
                  0
                ) / employees.length
              );

        const totalXp = employees.reduce(
          (sum, emp) => sum + (emp.totalXp || 0),
          0
        );

        setAnalytics(analyticsData);
        setMonitoringSnapshot({
          avgProgress,
          totalEmployees: employees.length,
          totalXp,
        });
      } catch (err) {
        console.error("Admin overview load error:", err);
      } finally {
        if (active) setLoadingOverview(false);
      }
    };

    loadOverview();

    return () => {
      active = false;
    };
  }, [token]);

  const quickStats = useMemo(() => {
    const totalUsers = analytics?.totalUsers ?? 0;
    const totalModules = analytics?.totalModules ?? 0;
    const totalAssignments = analytics?.totalAssignments ?? 0;

    const avgProgress = monitoringSnapshot?.avgProgress ?? 0;
    const totalEmployees = monitoringSnapshot?.totalEmployees ?? 0;
    const totalXp = monitoringSnapshot?.totalXp ?? 0;

    return [
      {
        label: "People",
        value: totalUsers.toLocaleString(),
        detail: `${analytics?.totalAdmins ?? 0} admins • ${
          analytics?.totalTrainers ?? 0
        } trainers`,
      },
      {
        label: "Learning Assets",
        value: totalModules.toLocaleString(),
        detail: `${totalAssignments.toLocaleString()} live assignments`,
      },
      {
        label: "Momentum",
        value: `${avgProgress}% avg progress`,
        detail: `${totalEmployees} active learners • ${totalXp.toLocaleString()} XP`,
      },
    ];
  }, [analytics, monitoringSnapshot]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/70 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-indigo-100/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-3 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Control</p>
              <h2 className="text-xl font-semibold">SkillQuest HQ</h2>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow"
                      : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                  }`
                }
              >
                <Icon
                  className="h-4 w-4 text-indigo-500 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-100/70 transition hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-8 pb-10">
          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-8 shadow-xl shadow-indigo-50">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-500">
                  Mission Control
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                  Admin Command Center
                </h1>
                <p className="mt-3 max-w-2xl text-base text-slate-600">
                  Orchestrate learning programs, keep trainers aligned, and respond to
                  performance signals in real time. Everything you need to steer the
                  program lives here.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/admin/analytics")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  View Analytics
                </button>
                <button
                  onClick={() => navigate("/admin/create-module")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/70 hover:-translate-y-0.5"
                >
                  <Layers className="h-4 w-4" />
                  New Module
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.detail}</p>
              </article>
            ))}
            {loadingOverview && (
              <article className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-6 text-sm text-indigo-500">
                Syncing fresh analytics…
              </article>
            )}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {actionCards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.to)}
                className={`group rounded-3xl border border-slate-100 bg-gradient-to-br ${card.accent} p-6 text-left shadow-sm transition hover:-translate-y-1`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Shortcut
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{card.description}</p>
              </button>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-lg shadow-slate-200/60">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
