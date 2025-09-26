// src/components/HowItWorks.js
import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-200"></div>

          {/* Step 1 */}
          <div className="relative flex items-start justify-between">
            <div className="w-1/2 pr-8 text-right">
              <div className="p-5 rounded-lg bg-gray-50 border border-gray-200 shadow-md">
                <h3 className="text-lg font-bold text-gray-900">Sign Up & Create Avatar</h3>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bg-white p-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold ring-4 ring-white">1</div>
            </div>
            <div className="w-1/2"></div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start justify-between mt-16">
            <div className="w-1/2"></div>
            <div className="absolute left-1/2 -translate-x-1/2 bg-white p-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold ring-4 ring-white">2</div>
            </div>
            <div className="w-1/2 pl-8 text-left">
              <div className="p-5 rounded-lg bg-gray-50 border border-gray-200 shadow-md">
                <h3 className="text-lg font-bold text-gray-900">Start Quests & Earn Points</h3>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-start justify-between mt-16">
            <div className="w-1/2 pr-8 text-right">
              <div className="p-5 rounded-lg bg-gray-50 border border-gray-200 shadow-md">
                <h3 className="text-lg font-bold text-gray-900">Compete, Learn, & Win</h3>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bg-white p-1 rounded-full">
              <div className="h-8 w-8 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold ring-4 ring-white">3</div>
            </div>
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
