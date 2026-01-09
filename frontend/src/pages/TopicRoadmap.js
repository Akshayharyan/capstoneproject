// src/pages/TopicRoadmap.js
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Lock,
  CheckCircle,
  Zap,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function TopicRoadmap() {
  console.log("🔥 NEW TopicRoadmap LOADED");

  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const containerRef = useRef(null);
  const nodeRefs = useRef([]);

  const [topics, setTopics] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TOPICS (BACKEND TRUTH) ================= */
  useEffect(() => {
    const fetchTopics = async () => {
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      setTopics(data.topics || []);
      setModuleTitle(data.moduleTitle || "Learning Path");
      setProgressPercent(data.progressPercent || 0);
      setLoading(false);
    };

    fetchTopics();
  }, [moduleId, token]);

  /* ================= SVG CURVED PATHS ================= */
  useEffect(() => {
    if (!containerRef.current || topics.length === 0) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPaths = [];

    for (let i = 0; i < nodeRefs.current.length - 1; i++) {
      const from = nodeRefs.current[i];
      const to = nodeRefs.current[i + 1];
      if (!from || !to) continue;

      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const fromLeft = i % 2 === 0;

      const x1 = fromLeft
        ? a.right - containerRect.left
        : a.left - containerRect.left;
      const x2 = fromLeft
        ? b.left - containerRect.left
        : b.right - containerRect.left;

      const y1 = a.top + a.height / 2 - containerRect.top;
      const y2 = b.top + b.height / 2 - containerRect.top;

      const dx = Math.abs(x2 - x1) * 0.6;

      newPaths.push({
        d: `
          M ${x1} ${y1}
          C ${x1 + (fromLeft ? dx : -dx)} ${y1},
            ${x2 - (fromLeft ? dx : -dx)} ${y2},
            ${x2} ${y2}
        `,
        completed: topics[i].status === "completed",
      });
    }

    setPaths(newPaths);
  }, [topics]);

  if (loading) {
    return (
      <p className="text-center mt-32 text-gray-500 animate-pulse">
        Loading learning path…
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32 relative overflow-hidden"
    >
      {/* HEADER */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold mb-4">
          <Trophy className="w-4 h-4" />
          {moduleTitle}
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Your Learning Journey
        </h1>

        {/* PROGRESS BAR */}
        <div className="max-w-md mx-auto">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {progressPercent}% Completed
          </p>
        </div>
      </div>

      {/* SVG CONNECTORS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.completed ? "#22c55e" : "#cbd5e1"}
            strokeWidth="4"
            strokeDasharray={p.completed ? "0" : "6 6"}
          />
        ))}
      </svg>

      {/* ROADMAP */}
      <div className="max-w-3xl mx-auto relative z-10">
        {topics.map((topic, i) => {
          const left = i % 2 === 0;

          return (
            <motion.div
              key={i}
              ref={(el) => (nodeRefs.current[i] = el)}
              className={`flex mb-32 ${
                left ? "justify-start" : "justify-end"
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="flex items-center gap-6">
                {/* NODE ICON (RESTORED & IMPROVED) */}
                <button
                  disabled={topic.status === "locked"}
                  onClick={() =>
                    topic.status !== "locked" &&
                    navigate(`/modules/${moduleId}/topic/${i}/video`)
                  }
                  className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-white shadow-2xl transition
                    ${
                      topic.status === "completed"
                        ? "bg-emerald-500"
                        : topic.status === "active"
                        ? "bg-indigo-500 animate-pulse ring-4 ring-indigo-300"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  {topic.status === "completed" && <CheckCircle />}
                  {topic.status === "active" && <Play />}
                  {topic.status === "locked" && <Lock />}
                </button>

                {/* CARD (MORE ATTRACTIVE) */}
                <div className="bg-white rounded-3xl p-6 w-80 shadow-xl border border-gray-100 hover:shadow-2xl transition">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">
                    {topic.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                      <Zap className="w-3 h-3" />
                      {topic.xp} XP
                    </span>

                    {topic.status === "completed" && (
                      <span className="text-emerald-600 font-semibold">
                        ✔ Completed
                      </span>
                    )}
                    {topic.status === "active" && (
                      <span className="text-indigo-500 font-semibold">
                        ● Active
                      </span>
                    )}
                    {topic.status === "locked" && (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </div>

                  {/* CTA */}
                  {topic.status === "active" && (
                    <button className="mt-2 text-indigo-600 font-semibold hover:underline">
                      Start Topic →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* FINAL TROPHY */}
        {topics.length > 0 &&
          topics.every((t) => t.status === "completed") && (
            <div className="flex justify-center mt-20">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-2xl ring-4 ring-yellow-300/40">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
