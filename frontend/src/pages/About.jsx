import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Lightbulb,
  Heart,
  Rocket,
  Globe,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "Empowering organizations to build skilled, confident teams through engaging learning experiences.",
      color: "from-blue-500 to-blue-400",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "Using gamification to make corporate training effective and enjoyable.",
      color: "from-purple-500 to-purple-400",
    },
    {
      icon: Heart,
      title: "People-Centered",
      description:
        "Every feature is designed to support learner growth and motivation.",
      color: "from-red-500 to-red-400",
    },
    {
      icon: Users,
      title: "Collaborative",
      description:
        "Learning grows stronger through teamwork and shared success.",
      color: "from-green-500 to-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
            <Globe className="w-4 h-4" />
            Transforming Corporate Learning
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Making Learning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 inline-flex items-center gap-2">
              Irresistible <Zap className="w-6 h-6" />
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            SkillQuest blends gamification with modern learning design to create
            training experiences employees genuinely enjoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Begin Your Journey
            </Link>

            <Link
              to="/features"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Explore Features
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4"
        >
          <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Quest?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of learners leveling up their skills with SkillQuest.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 border-t text-center text-gray-500 text-sm">
        © 2024 SkillQuest. All rights reserved.
      </footer>
    </div>
  );
};

export default About;