import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-lg">Loading users…</p>;

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const trainers = users.filter(u => u.role === "trainer").length;
  const active = users.filter(u => u.status !== "inactive").length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage employees and trainers</p>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Search users..."
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-xl shadow">
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={totalUsers} color="teal" />
        <StatCard label="Trainers" value={trainers} color="orange" />
        <StatCard label="Active" value={active} color="green" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50 transition">

                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    {u.name?.[0]}
                  </div>
                  <span className="font-medium">{u.name}</span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : u.role === "trainer"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">{u.email}</td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const styles = {
    teal: "bg-teal-100 text-teal-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-md border p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles[color]}`}>
        👤
      </div>
    </div>
  );
}