// src/components/CTA.js
import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section
      className="py-16 md:py-24 text-center"
      style={{ backgroundColor: "#111827" }} // same as Leaderboard outer background
    >
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Quest?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join <span className="text-purple-400 font-semibold">SkillQuest</span> today and 
            level up your technical skills while having fun!
          </p>
          <Link
            to="/signup"
            className="px-8 py-3 rounded-lg text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </section>
  );
}
