import React from "react";
import Footer from "../components/Footer";
import LeaderboardPreview from "../components/LeaderboardPreview";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import HeroSection from "../components/HeroSection";

function Home() {
  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
     <HeroSection />

      {/* Unlock Your Potential Section */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>Unlock Your Potential</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "10px", color: "#22c55e" }}>🎯 Quests & Levels</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Learn step by step with interactive quests designed to boost your coding skills.
            </p>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "10px", color: "#22c55e" }}>🏆 Badges & Achievements</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Earn badges and celebrate milestones as you progress through modules.
            </p>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "10px", color: "#22c55e" }}>📊 Leaderboards</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Compete with peers and see where you stand on the leaderboard.
            </p>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "10px", color: "#22c55e" }}>💻 Coding Sandbox</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Practice in a built-in coding environment with instant feedback.
            </p>
          </div>
        </div>
      </section>

      {/* ===== How It Works Section ===== */}
<HowItWorks />


     
{/* Leaderboard Preview Section */}
<LeaderboardPreview />



      {/* Call to Action Section */}
     <CallToAction />
     <Footer />

     
    </div>
  );
}

export default Home;
