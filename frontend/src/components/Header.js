import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px",
        background: "#1E293B", // modern navy background
        color: "#fff",
      }}
    >
      {/* Brand / Logo */}
      <Link
        to="/"
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#3B82F6", // blue accent
          textDecoration: "none",
        }}
      >
        SkillQuest
      </Link>

      {/* Center Navigation */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/quests" style={{ color: "#fff", textDecoration: "none" }}>Quests</Link>
        <Link to="/leaderboard" style={{ color: "#fff", textDecoration: "none" }}>Leaderboard</Link>
      </div>

      {/* Right Side (Auth Links) */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/login"
          style={{
            marginRight: "12px",
            padding: "6px 14px",
            border: "1px solid #3B82F6",
            borderRadius: "6px",
            color: "#3B82F6",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          style={{
            padding: "8px 16px",
            background: "#3B82F6",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: "500",
            textDecoration: "none",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#2563EB")}
          onMouseOut={(e) => (e.target.style.background = "#3B82F6")}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Header;
