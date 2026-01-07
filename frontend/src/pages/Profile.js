import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Error loading profile:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <p className="text-center mt-32 text-lg font-semibold text-slate-500">
        Loading profile…
      </p>
    );
  }

  const avatarSeed = user?.name?.replace(/\s+/g, "") || "User";
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${avatarSeed}`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-sky-50 to-orange-50">
      
      {/* MAIN CONTENT */}
      <main className="flex-grow px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="profile"
                  className="w-28 h-28 rounded-full border-4 border-white shadow"
                />
                <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  {user.level}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-slate-800">
                    {user.name}
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">
                    Rising Star
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-1">
                  Passionate learner focused on full-stack development and cloud technologies.
                </p>

                <div className="flex gap-6 mt-3 text-xs text-slate-500">
                  <span>{user.email}</span>
                  <span>Joined Jan 2024</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.xp} XP</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 w-[70%]" />
                  </div>
                </div>
              </div>

              <button className="text-sm px-4 py-2 rounded-lg bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200">
                Edit Profile
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <p className="text-2xl font-extrabold text-orange-500">{user.xp}</p>
              <p className="text-sm text-slate-500">Total XP</p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <p className="text-2xl font-extrabold text-teal-500">8</p>
              <p className="text-sm text-slate-500">Modules</p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <p className="text-2xl font-extrabold text-blue-500">47</p>
              <p className="text-sm text-slate-500">Tasks</p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow">
              <p className="text-2xl font-extrabold text-pink-500">15</p>
              <p className="text-sm text-slate-500">Day Streak</p>
            </div>
          </div>

          {/* ACHIEVEMENTS + ACTIVITY */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Achievements</h3>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                  {user.badges.length}/6
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {user.badges.map((b, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border bg-slate-50 text-center text-sm font-semibold text-slate-700"
                  >
                    🏆 {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow">
              <h3 className="font-bold text-slate-800 mb-4">Activity</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>✅ Completed React Hooks Deep Dive</p>
                <p>🚀 Started TypeScript Advanced</p>
                <p>🏆 Earned Perfect Score</p>
                <p>🧠 Completed State Quiz</p>
              </div>
              <button className="mt-4 w-full text-sm font-semibold text-teal-600 hover:underline">
                View All Activity →
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/70 backdrop-blur border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700">SkillQuest</span>. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-teal-600 transition">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-teal-600 transition">
              Terms
            </a>
            <a href="#" className="text-slate-500 hover:text-teal-600 transition">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
