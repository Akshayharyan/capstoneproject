import React from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  
  Users,
  BarChart3,
  
  Shield,
  Zap,
  Brain,
  Star,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white rounded-xl border shadow-sm p-6 transition"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="text-white w-5 h-5" />
    </div>
    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-2">{desc}</p>
  </motion.div>
);

export default function Features() {
  return (
    <div className="bg-[#f9fbfc] text-gray-800">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Everything You Need to{" "}
          <span className="text-emerald-500">Level Up</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          Discover the features that make SkillQuest the most engaging corporate
          learning platform.
        </p>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {["Gamified", "Adaptive", "AI-Driven", "Real-Time"].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1 text-sm rounded-full bg-emerald-50 text-emerald-600 border"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ================= CORE FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-20 grid md:grid-cols-2 gap-8">
        <FeatureCard
          icon={Flame}
          title="Gamified Learning"
          desc="Points, levels, streaks and rewards that boost engagement."
          color="bg-orange-500"
        />
        <FeatureCard
          icon={Trophy}
          title="Achievement System"
          desc="Badges and milestones to recognize progress."
          color="bg-yellow-500"
        />
        <FeatureCard
          icon={BarChart3}
          title="Advanced Analytics"
          desc="Track performance with real-time insights."
          color="bg-indigo-500"
        />
        <FeatureCard
          icon={Users}
          title="Team Collaboration"
          desc="Challenges and leaderboards for teamwork."
          color="bg-pink-500"
        />
      </section>

      {/* ================= LEARNING PATHS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold">Learning Paths That Adapt</h2>
          <ul className="mt-6 space-y-3 text-gray-600">
            <li>✔ Personalized skill progression</li>
            <li>✔ Adaptive difficulty levels</li>
            <li>✔ Role-based learning tracks</li>
            <li>✔ Continuous improvement insights</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Leadership Basics</span>
            <span className="text-sm text-emerald-600">70%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded">
            <div className="h-2 bg-emerald-500 rounded w-[70%]" />
          </div>

          <div className="mt-6 flex items-center justify-between mb-4">
            <span className="font-semibold">React Fundamentals</span>
            <span className="text-sm text-sky-600">45%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded">
            <div className="h-2 bg-sky-500 rounded w-[45%]" />
          </div>
        </div>
      </section>

      {/* ================= MORE FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-24 text-center">
        <h2 className="text-2xl font-bold">And So Much More</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {[ 
            { icon: Brain, title: "AI-Powered Paths" },
            { icon: Star, title: "Instant Feedback" },
            { icon: Shield, title: "Enterprise Security" },
            { icon: Zap, title: "Mobile-First" },
          ].map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              <Icon className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="mt-3 font-medium">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY SKILLQUEST ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why SkillQuest?
        </h2>

        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th className="p-4">Traditional</th>
                <th className="p-4 text-emerald-600">SkillQuest</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Engagement", "Low", "High"],
                ["Completion", "Average", "90%+"],
                ["Personalization", "Limited", "AI-Driven"],
                ["Mobile Support", "Poor", "Excellent"],
              ].map((row) => (
                <tr key={row[0]} className="border-t">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`p-4 text-center ${
                        i === 2 ? "text-emerald-600 font-semibold" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mt-28 bg-gradient-to-r from-emerald-50 to-sky-50 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to Experience the Difference?
        </h2>
        <p className="text-gray-600 mt-3">
          Start building skills that matter today.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border font-medium hover:bg-white"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}
