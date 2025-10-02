import React from "react";
import Footer from "../components/Footer";
import LeaderboardPreview from "../components/LeaderboardPreview";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import HeroSection from "../components/HeroSection";

function Home() {
  const features = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/814/814513.png",
      title: "Quests & Levels",
      desc: "Learn step by step with interactive quests designed to boost your coding skills.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      title: "Badges & Achievements",
      desc: "Earn badges and celebrate milestones as you progress through modules.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      title: "Leaderboards",
      desc: "Compete with peers and see where you stand on the leaderboard.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/2721/2721265.png",
      title: "Coding Sandbox",
      desc: "Practice in a built-in coding environment with instant feedback.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Unlock Your Potential Section */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "15px", color: "#fff" }}>
          Unlock Your Potential
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "40px" }}>
          Explore the features that make SkillQuest the ultimate training platform.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "left",
                boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 18px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
              }}
            >
              <img
                src={feature.img}
                alt={feature.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  background: "#0f172a",
                  padding: "10px",
                }}
              />
              <h3 style={{ marginBottom: "10px", color: "#22c55e", fontSize: "1.25rem" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Leaderboard Preview Section */}
      <LeaderboardPreview />

      {/* Call to Action Section */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
