// src/pages/Profile.js
import React, { useState } from "react";

const TABS = ["Overview", "Achievements", "Settings"];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* Profile Header */}
      <div className="bg-[#1e293b] rounded-xl p-8 text-center shadow-lg">
        <img
          src="https://i.pravatar.cc/150?img=47"
          alt="profile"
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-600"
        />
        <h2 className="text-2xl font-bold">Sophia Bennett</h2>
        <p className="text-gray-400">Senior Marketing Manager</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 space-x-8 border-b border-gray-700 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 ${
              activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-10">
        {activeTab === "Overview" && (
          <>
            {/* Profile Summary */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
              <div className="bg-[#1e293b] rounded-xl p-6 space-y-3">
                <p>
                  <span className="font-semibold">Name:</span> Sophia Bennett
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  sophia.bennett@example.com
                </p>
                <p>
                  <span className="font-semibold">Skills:</span> Marketing,
                  Strategy, Leadership
                </p>
              </div>
            </section>

            {/* Skill Progress */}
            <section className="mt-10">
              <h3 className="text-lg font-semibold mb-4">Skill Progress</h3>
              <div className="bg-[#1e293b] rounded-xl p-6 space-y-4">
                {[
                  { skill: "Marketing Skills", percent: 75 },
                  { skill: "Strategy Skills", percent: 50 },
                  { skill: "Leadership Skills", percent: 90 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.skill}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Recommendations */}
            <section className="mt-10">
              <h3 className="text-lg font-semibold mb-4">
                Learning Recommendations
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    img: "https://placehold.co/300x200?text=Marketing+Course",
                    title: "Advanced Marketing Techniques",
                    desc: "Enhance your marketing skills with advanced techniques.",
                  },
                  {
                    img: "https://placehold.co/300x200?text=Strategy+Course",
                    title: "Strategic Planning for Growth",
                    desc: "Develop strategic planning skills for business growth.",
                  },
                  {
                    img: "https://placehold.co/300x200?text=Leadership+Course",
                    title: "Leading High-Performance Teams",
                    desc: "Learn to lead and motivate high-performance teams.",
                  },
                ].map((course, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e293b] rounded-xl p-4 hover:scale-105 transition"
                  >
                    <img
                      src={course.img}
                      alt={course.title}
                      className="rounded-lg mb-3"
                    />
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-gray-400 text-sm">{course.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "Achievements" && (
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <p className="text-gray-400">🏆 Coming soon…</p>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="bg-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <p className="text-gray-400">⚙️ Settings panel placeholder…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
