// src/components/HeroSection.js
import React from "react";

export default function HeroSection() {
  const bg = `linear-gradient(to bottom, rgba(16,24,40,0.85), rgba(16,24,40,0.95)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_v9zGp1mI9ggDzMAl5Qo3AupvZZoSBqDNsZqmoBggaEAlgxl57B57DhTVArEoAi3vGHIoDHnMbtVtyIIBiiw16BdhV7_A7NjzC4MsVcUKQlFJT6w4Z7vTDtleOLaGmtTQODywhNvV-3zwXeP1j-7KSzLqpEU0c4SXH4k846RPKwpNH_MIPd32ntI1FnX4G_XvGNMDuQYAo8m3YQM8JPLfYJbAHnouF-KkbjbOtQpOFd0ipFKwTFN0g36M6hd78ndyAYQiQQyR_74")`;

  return (
    <section className="relative py-24 md:py-32 flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: bg }}>
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          Level Up Your Skills.<br />Train Like a Pro, <span className="text-emerald-400">Play Like a Game.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
          Interactive quests, coding challenges, and achievements for modern software teams.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 text-base font-semibold text-black rounded-lg bg-emerald-400 hover:opacity-95 transition-all shadow-lg">
            Sign Up Now
          </button>
          <button className="px-8 py-3 text-base font-semibold rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all">
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  );
}
