import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { useAuth } from "../../context/AuthContext";
import { Play, Lock, Zap } from "lucide-react";

export default function TopicVideoPage() {
  const { moduleId, topicIndex } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [topic, setTopic] = useState(null);
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  /* ================= FETCH TOPIC ================= */
  useEffect(() => {
    const fetchTopic = async () => {
      const res = await fetch(
        `http://localhost:5000/api/modules/${moduleId}/topics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      const selectedTopic = data.topics?.[topicIndex];
      setTopic(selectedTopic || null);
    };

    fetchTopic();
  }, [moduleId, topicIndex, token]);

  /* ================= VIDEO PROGRESS ================= */
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const duration = player.getDuration();
      const current = player.getCurrentTime();

      if (duration > 0) {
        const percent = Math.floor((current / duration) * 100);
        setProgress(percent);

        if (percent >= 90) {
          setCanProceed(true);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  /* ================= VIDEO ID ================= */
  const getVideoId = (url) => {
    if (!url) return null;
    if (url.includes("/embed/")) return url.split("/embed/")[1];
    if (url.includes("watch?v=")) return url.split("watch?v=")[1];
    return null;
  };

  if (!topic) {
    return (
      <p className="text-center mt-32 text-gray-500 animate-pulse">
        Loading lesson…
      </p>
    );
  }

  const videoId = getVideoId(topic.videoUrl);

  if (!videoId) {
    return (
      <p className="text-center mt-32 text-red-500">
        Video not available for this topic.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 px-4 pt-24 pb-32">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-0 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold mb-4">
          <Play className="w-4 h-4" />
          Video Lesson
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          {topic.title}
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Watch the complete lesson to unlock quizzes and coding challenges.
        </p>
      </div>

      {/* VIDEO CARD */}
      <div className="max-w-4xl mx-auto mb-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden">
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "460",
            playerVars: { autoplay: 0 },
          }}
          onReady={(e) => setPlayer(e.target)}
        />
      </div>

      {/* PROGRESS */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600 font-medium">Lesson Progress</span>
          <span className="font-bold text-indigo-600">{progress}%</span>
        </div>

        <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!canProceed && (
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Complete at least 90% to continue
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto text-center">
        <button
          disabled={!canProceed}
          onClick={() =>
            navigate(`/modules/${moduleId}/topic/${topicIndex}/challenges`)
          }
          className={`
            inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-semibold
            transition
            ${
              canProceed
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <Zap className="w-5 h-5" />
          {canProceed ? "Start Quiz & Coding" : "Finish Video to Unlock"}
        </button>
      </div>
    </div>
  );
}
