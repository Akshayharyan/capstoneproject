// src/components/HowItWorks.js
import React from "react";
import { UserPlus, Target, Trophy } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#0f172a] text-white">

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white">How It Works</h2>
          <p className="text-gray-400 mt-3">
            Just 3 steps to start your SkillQuest journey 🚀
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical gradient line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 transform -translate-x-1/2"></div>

          {/* Step 1 */}
          <div className="relative flex items-center mb-16">
            <div className="w-1/2 pr-8 text-right">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-purple-500/20 transition">
                <h3 className="text-xl font-semibold text-white">Create Your Profile</h3>
                <p className="mt-2 text-gray-400">Sign up, build your avatar, and set learning goals.</p>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="w-1/2"></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center mb-16">
            <div className="w-1/2"></div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="w-1/2 pl-8 text-left">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-blue-500/20 transition">
                <h3 className="text-xl font-semibold text-white">Start Quests</h3>
                <p className="mt-2 text-gray-400">Complete coding challenges and earn XP as you go.</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center">
            <div className="w-1/2 pr-8 text-right">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-green-500/20 transition">
                <h3 className="text-xl font-semibold text-white">Climb the Leaderboard</h3>
                <p className="mt-2 text-gray-400">Compete with peers, unlock rewards, and celebrate wins!</p>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <a
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}
