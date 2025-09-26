// src/components/Testimonials.js
import React from "react";

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-xl bg-gray-50 border border-gray-200 shadow-md">
            <p className="text-gray-600 italic">"Training never felt this fun! The gamified approach kept me engaged and motivated."</p>
            <div className="flex items-center mt-6">
              <img alt="Sarah" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_lYXGETyF6iG3PPiMPyoVrC-aNHxrjQJ7g7fZJM-4UBWEO_elsDwhoIWvIpB3mXZtV4dcSPCSvmbRN2Istu3Il-qKV9V2avd7gR5a63Kq3W1pSDjOF0yY-zCTtsnSykuZ_1XNTkSSaqBYkz5R90YkGAt3TJ8f_zd20mL3sX6gxBagmr9h_pMGDxAFh888axBDejW4lrNhadtbXyi9I6wg8U3VgXUMhw0CUq8Rtcs9DYDepZa-JNi1a75Kw7gXpYsOqQzLm9rZWIw" />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Sarah L.</p>
                <p className="text-sm text-gray-600">Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-gray-50 border border-gray-200 shadow-md">
            <p className="text-gray-600 italic">"SkillQuest has transformed our team's learning experience. It's competitive, fun, and effective."</p>
            <div className="flex items-center mt-6">
              <img alt="David" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtCU7BbSQdUg1m1Hggj5-bfTwdJUpuuYtfunDv0c03vQ8ni2THZBfay_bA9tru50pfSIh8_ltFh-5wtomIacXGmpWSXgUFzjkx1HdsZu0wJJd7oZM77Qfhq-ih6vuUWsjs_ABHipVKJnBIezjipqgaxOYgeYMRtKKU8qm55yvxfO3by-eYgf5wqknC8Ukxbp52TwY2OefIrNxcJ_pJs3mlfD31TGJSX4OAkfleTk80zUf7vX5MnUG5mY0EDXux-EZ2e5kH9Pf7yNk" />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">David C.</p>
                <p className="text-sm text-gray-600">Team Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
