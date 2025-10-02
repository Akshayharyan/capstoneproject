// src/components/CTA.js
import React from "react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-[#0f172a] text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-gray-700">
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to Start Your Quest?
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Join <span className="text-indigo-400 font-semibold">SkillQuest</span> today and 
            <span className="text-green-400"> level up your skills</span>, 
            unlock <span className="text-yellow-400">achievements</span>, and 
            climb the <span className="text-pink-400">leaderboards</span> while having fun!
          </p>

          {/* Call to Action */}
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-xl text-lg font-semibold
                       bg-indigo-600 hover:bg-indigo-700 text-white
                       shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            🚀 Sign Up Now
          </Link>

          {/* Bonus sub-text */}
          <p className="mt-6 text-sm text-gray-400">
            No risks. Just pure learning + fun. ⚡
          </p>
        </div>
      </div>
    </section>
  );
}
