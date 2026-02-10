import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const EmployeeMonitoringPage = () => {
  const { token } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/employee-monitoring",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setEmployees(data.employees || []);
      } catch (err) {
        console.error("Failed to load employee monitoring", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading employee progress…
      </div>
    );
  }

  /* ================== STATS ================== */
  const totalEmployees = employees.length;
  const avgProgress =
    employees.reduce((a, e) => a + e.progressPercent, 0) /
      (employees.length || 1);

  const totalXp = employees.reduce((a, e) => a + e.totalXp, 0);
  const totalCompleted = employees.reduce(
    (a, e) => a + e.completedModules,
    0
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Employee Monitoring
        </h1>
        <p className="text-gray-600 mt-1">
          Track learning progress and XP across employees
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Employees" value={totalEmployees} />
        <StatCard label="Average Progress" value={`${avgProgress.toFixed(0)}%`} />
        <StatCard label="Total XP Earned" value={totalXp.toLocaleString()} />
        <StatCard label="Modules Completed" value={totalCompleted} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm text-gray-600">Employee</th>
              <th className="px-6 py-4 text-sm text-gray-600">XP</th>
              <th className="px-6 py-4 text-sm text-gray-600">Modules</th>
              <th className="px-6 py-4 text-sm text-gray-600">Progress</th>
              <th className="px-6 py-4 text-sm text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e) => {
              const status =
                e.progressPercent === 100
                  ? "Completed"
                  : e.progressPercent >= 60
                  ? "On Track"
                  : "Behind";

              return (
                <tr
                  key={e.userId}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* EMPLOYEE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100
                                      text-purple-700 font-bold flex items-center justify-center">
                        {e.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {e.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {e.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* XP */}
                  <td className="px-6 py-4 font-semibold text-purple-700">
                    ⚡ {e.totalXp}
                  </td>

                  {/* MODULES */}
                  <td className="px-6 py-4 text-gray-700">
                    {e.completedModules} / {e.totalModules}
                  </td>

                  {/* PROGRESS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${e.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {e.progressPercent}%
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          status === "Completed"
                            ? "bg-purple-100 text-purple-700"
                            : status === "On Track"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================== STAT CARD ================== */
const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">
      {value}
    </p>
  </div>
);

export default EmployeeMonitoringPage;
