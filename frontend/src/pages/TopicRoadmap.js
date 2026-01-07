import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Lock,
  CheckCircle,
  Zap,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";

function TopicRoadmap() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  /* ================= FETCH TOPICS ================= */
  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setData(json);
    };
    fetchTopics();
  }, [moduleId]);

  if (!data) {
    return (
      <p className="text-center mt-32 text-gray-500 animate-pulse">
        Loading your learning path…
      </p>
    );
  }

  const { moduleTitle, topics } = data;

  /* ================= STATUS ================= */
  const getStatus = (index) => {
    if (index === 0) return "unlocked";
    return "locked";
  };

  const nodeColor = (status) => {
    if (status === "completed") return "from-emerald-400 to-emerald-500";
    if (status === "unlocked") return "from-indigo-500 to-purple-500";
    return "from-gray-300 to-gray-400";
  };

  const nodeIcon = (status) => {
    if (status === "completed") return <CheckCircle />;
    if (status === "unlocked") return <Play />;
    return <Lock />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32">

      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold mb-5">
          <Trophy className="w-4 h-4" />
          {moduleTitle}
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Your Learning Journey
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto">
          Watch lessons, unlock challenges, and earn XP as you progress 🚀
        </p>
      </div>

      {/* ROADMAP */}
      <div className="max-w-3xl mx-auto">
        {topics.map((topic, index) => {
          const status = getStatus(index);
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex mb-24 ${isLeft ? "justify-start" : "justify-end"}`}
            >
              <div className="flex items-center gap-6">

                {/* NODE */}
                <button
                  disabled={status === "locked"}
                  onClick={() =>
                    status !== "locked" &&
                    navigate(`/modules/${moduleId}/topic/${index}/video`)
                  }
                  className={`
                    w-18 h-18 w-[72px] h-[72px]
                    rounded-full flex items-center justify-center
                    text-white shadow-xl
                    bg-gradient-to-br ${nodeColor(status)}
                    ${status !== "locked" ? "hover:scale-110" : "opacity-60 cursor-not-allowed"}
                    transition
                  `}
                >
                  {nodeIcon(status)}
                </button>

                {/* CARD */}
                <div
                  className={`
                    bg-white/70 backdrop-blur-md
                    rounded-3xl p-5 w-64
                    shadow-xl shadow-indigo-100
                    transition
                    ${status !== "locked" ? "hover:-translate-y-1 hover:shadow-2xl" : "opacity-60"}
                  `}
                >
                  <h3 className="font-bold text-gray-900 mb-2">
                    {topic.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                      <Zap className="w-3 h-3" />
                      {topic.xp} XP
                    </span>

                    {status === "unlocked" && (
                      <span className="text-indigo-500 font-semibold animate-pulse">
                        ● Active
                      </span>
                    )}

                    {status === "locked" && (
                      <span className="text-gray-400">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}

        {/* FINISH TROPHY */}
        <div className="flex justify-center mt-20">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-2xl ring-4 ring-yellow-300/40">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicRoadmap;
