import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-700 mb-6">👥 Users</h1>

      <div className="overflow-hidden rounded-xl bg-white border border-purple-200 shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr
                key={u._id}
                className={`border-t ${
                  i % 2 === 0 ? "bg-slate-50" : "bg-white"
                } hover:bg-purple-50 transition`}
              >
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : u.role === "trainer"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
