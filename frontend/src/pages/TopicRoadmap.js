import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

function TopicRoadmap() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);

  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setModuleData(data);
    };
    fetchTopics();
  }, [moduleId]);


  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const nodes = nodeRefs.current;
    if (!canvas || nodes.length === 0) return;

    const container = canvas.parentElement.getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#b073ff";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    const rects = nodes.map((el) => el.getBoundingClientRect());
    const centerX = canvas.width / 2;

    const yCenters = rects.map(
      (r) => r.top - container.top + r.height / 2
    );

    const topY = yCenters[0];
    const bottomY = yCenters[yCenters.length - 1];

    ctx.beginPath();
    ctx.moveTo(centerX, topY);
    ctx.lineTo(centerX, bottomY);
    ctx.stroke();

    const glow = (x, y) => {
      const g = ctx.createRadialGradient(x, y, 1, x, y, 20);
      g.addColorStop(0, "#fff");
      g.addColorStop(0.45, "#d59aff");
      g.addColorStop(1, "rgba(213,154,255,0)");
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const offset = 110; // Horizontal connector length

    rects.forEach((rect, index) => {
      const y = rect.top - container.top + rect.height / 2;

      const goesRight = index % 2 === 0; // FIX: even index = right, odd = left

      const xEnd = goesRight
        ? centerX + offset
        : centerX - offset;

      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();

      glow(centerX, y);
    });
  };


  useEffect(() => {
    setTimeout(redrawCanvas, 300);
    window.addEventListener("scroll", redrawCanvas);
    window.addEventListener("resize", redrawCanvas);
    return () => {
      window.removeEventListener("scroll", redrawCanvas);
      window.removeEventListener("resize", redrawCanvas);
    };
  }, [moduleData]);


  if (!moduleData) return <p className="text-white text-center mt-20 text-xl">Loading…</p>;

  const {  topics } = moduleData;


  return (
   <div className="relative min-h-[100vh] w-full bg-gradient-to-b from-[#0d0f1a] to-[#010203] text-white py-10 flex flex-col items-center">


      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>

      <h1 className="text-4xl font-extrabold text-yellow-400 mb-14 z-0">
        — Topic Journey 🚀
      </h1>

      <div className="flex flex-col gap-32 w-full max-w-[1200px] z-10">
        {topics.map((topic, index) => (
          <div
            key={index}
            ref={(el) => (nodeRefs.current[index] = el)}
            className={`flex w-full ${
              index % 2 === 0 ? "justify-end pr-32" : "justify-start pl-32"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              onClick={() => navigate(`/modules/${moduleId}/topics/${index}/levels`)}
              className="w-72 p-6 rounded-3xl text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-indigo-300 shadow-2xl cursor-pointer"
            >
              <h3 className="text-xl font-bold">{topic.title}</h3>
            </motion.div>
          </div>
        ))}
      </div>

      <button
        className="mt-20 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 font-semibold z-10"
        onClick={() => navigate("/modules")}
      >
        Back to Modules <ChevronRight />
      </button>
    </div>
  );
}

export default TopicRoadmap;
