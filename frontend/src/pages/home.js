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

      {/* Features Section */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>Unlock Your Potential</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>Quests & Levels</div>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>Badges & Achievements</div>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>Leaderboard</div>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>Coding Sandbox</div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>How It Works</h2>
        <ol style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>1. Sign Up & Create Account</li>
          <li style={{ marginBottom: "15px" }}>2. Start Quests & Earn Points</li>
          <li>3. Compete, Learn & Win</li>
        </ol>
      </section>

      {/* Leaderboard Preview */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Leaderboard Preview</h2>
        <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "60%", background: "#1e293b", borderRadius: "8px" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px" }}>Rank</th>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px" }}>1</td>
              <td style={{ padding: "10px" }}>Alice</td>
              <td style={{ padding: "10px" }}>1200</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>2</td>
              <td style={{ padding: "10px" }}>John</td>
              <td style={{ padding: "10px" }}>1100</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>3</td>
              <td style={{ padding: "10px" }}>Taylor</td>
              <td style={{ padding: "10px" }}>1000</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Call to Action */}
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
