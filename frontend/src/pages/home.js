import React from "react";

function Home() {
  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Level Up Your Skills. <br />
          <span style={{ color: "#22c55e" }}>Train Like a Pro, Play Like a Game.</span>
        </h1>
        <p style={{ marginTop: "15px", fontSize: "18px", color: "#cbd5e1" }}>
          Instead of boring lectures, experience gamified technical learning.
        </p>
        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </section>

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

      {/* How It Works Section */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>How It Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ color: "#22c55e", marginBottom: "10px" }}>📝 Step 1</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Sign up and create your profile to start your gamified learning journey.
            </p>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ color: "#22c55e", marginBottom: "10px" }}>🚀 Step 2</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Choose a quest, complete coding challenges, and earn points & badges.
            </p>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h3 style={{ color: "#22c55e", marginBottom: "10px" }}>🏆 Step 3</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              Track your progress, climb leaderboards, and showcase your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Leaderboard Preview</h2>
        <table
          style={{
            margin: "0 auto",
            borderCollapse: "collapse",
            width: "70%",
            background: "#1e293b",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#22c55e" }}>
              <th style={{ padding: "10px" }}>Rank</th>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", textAlign: "center" }}>1</td>
              <td style={{ padding: "10px" }}>Alice</td>
              <td style={{ padding: "10px", textAlign: "center" }}>1200</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", textAlign: "center" }}>2</td>
              <td style={{ padding: "10px" }}>John</td>
              <td style={{ padding: "10px", textAlign: "center" }}>1100</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", textAlign: "center" }}>3</td>
              <td style={{ padding: "10px" }}>Taylor</td>
              <td style={{ padding: "10px", textAlign: "center" }}>1000</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Call to Action Section */}
      <section style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "2rem" }}>Ready to Level Up?</h2>
        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Join SkillQuest Today
        </button>
      </section>
    </div>
  );
}

export default Home;
