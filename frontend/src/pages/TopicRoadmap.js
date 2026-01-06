import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";

function TopicRoadmap() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);

  /* ================= FETCH TOPICS ================= */
  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      setData(json);
    };

    fetchTopics();
  }, [moduleId]);

  /* ================= CANVAS DRAW ================= */
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const nodes = nodeRefs.current;
    if (!canvas || nodes.length === 0) return;

    const container = canvas.parentElement.getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    const rects = nodes.map((el) => el.getBoundingClientRect());
    const centerX = canvas.width / 2;

    rects.forEach((rect, index) => {
      const y = rect.top - container.top + rect.height / 2;
      const offset = 120;

      const xEnd =
        index % 2 === 0 ? centerX + offset : centerX - offset;

      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();

      // glow
      const g = ctx.createRadialGradient(centerX, y, 1, centerX, y, 18);
      g.addColorStop(0, "#fff");
      g.addColorStop(0.5, "#c084fc");
      g.addColorStop(1, "rgba(192,132,252,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(centerX, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useEffect(() => {
    setTimeout(redrawCanvas, 300);
    window.addEventListener("resize", redrawCanvas);
    window.addEventListener("scroll", redrawCanvas);
    return () => {
      window.removeEventListener("resize", redrawCanvas);
      window.removeEventListener("scroll", redrawCanvas);
    };
  }, [data]);

  if (!data) {
    return (
      <p className="text-white text-center mt-20 text-xl animate-pulse">
        Loading topics…
      </p>
    );
  }

  const { moduleTitle, topics } = data;

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0d0f1a] to-[#05060c] text-white py-12 flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-4 z-10">
        {moduleTitle}
      </h1>
      <p className="text-slate-300 mb-16 z-10">
        Click a topic to start watching & learning 🎥
      </p>

      {/* ROADMAP */}
      <div className="flex flex-col gap-32 w-full max-w-[1200px] z-10">
        {topics.map((topic, index) => (
          <div
            key={index}
            ref={(el) => (nodeRefs.current[index] = el)}
            className={`flex w-full ${
              index % 2 === 0
                ? "justify-end pr-32"
                : "justify-start pl-32"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.07, y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                navigate(
                  `/modules/${moduleId}/topic/${index}`
                )
              }
              className="
                w-80 p-6 rounded-3xl cursor-pointer
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                border border-indigo-300 shadow-2xl
              "
            >
              <div className="flex items-center gap-3 mb-2">
                <Play className="text-white" />
                <h3 className="text-xl font-bold">{topic.title}</h3>
              </div>

              <p className="text-sm text-indigo-100 mb-3">
                {topic.videoDuration || "5–10 mins"} · {topic.xp} XP
              </p>

              <span className="inline-block mt-2 text-xs bg-black/30 px-3 py-1 rounded-full">
                Start Watching →
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* BACK BUTTON */}
      <button
        className="
          mt-24 bg-gray-800 hover:bg-gray-700
          px-6 py-3 rounded-lg
          flex items-center gap-2 font-semibold z-10
        "
        onClick={() => navigate("/modules")}
      >
        Back to Modules <ChevronRight />
      </button>
    </div>
  );
}

export default TopicRoadmap;
