import React, { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Backend might return { users: [...] } or [...]
        const usersArray = Array.isArray(data) ? data : data.users;

        if (!Array.isArray(usersArray)) {
          console.error("Invalid user format:", data);
          setUsers([]);
        } else {
          setUsers(usersArray);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-xl">Loading users...</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-purple-500 bg-[#120b25] rounded-lg overflow-hidden">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-purple-600">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role || "user"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
