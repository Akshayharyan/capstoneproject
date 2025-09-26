import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backgroundColor: "#1A202C", // dark navy/gray background
      color: "#E2E8F0", // light gray text
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {/* Left side - Logo + App name */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "30px", height: "30px", background: "#38BDF8", borderRadius: "6px" }}></div>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>SkillQuest</h2>
      </div>

      {/* Center Nav Links */}
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#E2E8F0" }}>Home</Link>
        <Link to="/login" style={{ textDecoration: "none", color: "#E2E8F0" }}>Login</Link>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "#E2E8F0" }}>Dashboard</Link>
        <Link to="/quests" style={{ textDecoration: "none", color: "#E2E8F0" }}>Quests</Link>
        <Link to="/leaderboard" style={{ textDecoration: "none", color: "#E2E8F0" }}>Leaderboard</Link>
        <Link to="/admin" style={{ textDecoration: "none", color: "#E2E8F0" }}>Admin</Link>
      </nav>

      {/* Right side - Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{
          padding: "6px 12px",
          border: "1px solid #38BDF8",
          borderRadius: "6px",
          background: "transparent",
          color: "#38BDF8",
          cursor: "pointer"
        }}>
          Login
        </button>
        <button style={{
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          background: "#38BDF8",
          color: "#fff",
          cursor: "pointer"
        }}>
          Sign Up
        </button>
      </div>
    </header>
  );
}
