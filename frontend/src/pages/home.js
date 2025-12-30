import React from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";

function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER */}
     

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-[#f3fbfa] to-white px-6 pt-32">
        <div className="max-w-5xl w-full text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-600 text-sm font-medium mb-6">
            ✨ Gamified Corporate Learning Platform
          </div>

          {/* Heading */}
          <h1 className="text-[3.2rem] md:text-[4.5rem] lg:text-[5.2rem] font-extrabold leading-[1.05] tracking-tight text-slate-900">
            Level Up Your{" "}
            <span className="text-teal-500">Workforce</span>
            <br />
            One Quest at a Time
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Transform employee training into an engaging adventure. Build skills,
            earn rewards, and watch your team thrive with gamified learning paths.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="px-7 py-3 rounded-xl bg-teal-500 text-white font-semibold shadow-md hover:bg-teal-600 transition"
            >
              Get Started Free →
            </Link>

            <Link
              to="/login"
              className="px-7 py-3 rounded-xl border border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition"
            >
              Login to Continue
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-16 text-center flex-wrap">
            <div>
              <div className="text-3xl font-bold text-teal-500">10K+</div>
              <div className="text-sm text-slate-500">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-500">500+</div>
              <div className="text-sm text-slate-500">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-500">98%</div>
              <div className="text-sm text-slate-500">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>
    {/* ================= FLOATING STATS SECTION ================= */}
<section className="relative z-10 -mt-24 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="grid md:grid-cols-3 gap-6">

        {/* XP CARD */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-teal-50 to-white border border-teal-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl">
              ⚡
            </div>
            <div>
              <div className="text-sm text-slate-500">Total XP</div>
              <div className="text-2xl font-bold text-slate-900">2,450</div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-teal-100 overflow-hidden">
            <div className="h-full w-[75%] bg-teal-500 rounded-full" />
          </div>
        </div>

        {/* MODULES CARD */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
              📘
            </div>
            <div>
              <div className="text-sm text-slate-500">Modules</div>
              <div className="text-2xl font-bold text-slate-900">12 / 20</div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < 6 ? "bg-orange-500" : "bg-orange-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS CARD */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-yellow-50 to-white border border-yellow-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xl">
              ⭐
            </div>
            <div>
              <div className="text-sm text-slate-500">Achievements</div>
              <div className="text-2xl font-bold text-slate-900">
                8 Unlocked
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-white text-sm"
              >
                🏆
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* ================= FEATURE CARDS ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">

            {[
              {
                title: "Gamified Learning",
                desc: "Learn through exciting quests with XP, levels, and achievements.",
              },
              {
                title: "XP & Progression",
                desc: "Complete modules and unlock new challenges as you grow.",
              },
              {
                title: "Role-Based Paths",
                desc: "Learning journeys tailored to your role and career goals.",
              },
              {
                title: "Team Competition",
                desc: "Compete on leaderboards and grow together as a team.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#fffaf5] to-white">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-6">
            ⚡ Start Your Quest Today
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Training?
          </h2>

          <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Join thousands of companies using SkillQuest to build engaged,
            skilled, and motivated teams.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
            >
              Create Free Account →
            </Link>

            <Link
              to="/login"
              className="text-slate-700 font-medium hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;
