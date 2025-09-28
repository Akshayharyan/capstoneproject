// src/components/HeroSection.js
import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "100px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 15px rgba(34,197,94,0.6)", // green glow
        }}
      >
        Level Up Your Skills. <br />
        <span
          style={{
            color: "#22c55e",
            textShadow: "0 0 25px rgba(34,197,94,0.9)", // stronger glow
          }}
        >
          Train Like a Pro, Play Like a Game.
        </span>
      </h1>

      <p
        style={{
          marginTop: "15px",
          fontSize: "18px",
          color: "#cbd5e1",
          textShadow: "0 0 8px rgba(203,213,225,0.5)", // soft glow
        }}
      >
        Instead of boring lectures, experience gamified technical learning.
      </p>

      <Link to="/signup">
        <button
          style={{
            marginTop: "25px",
            padding: "14px 30px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow:
              "0 0 15px rgba(34,197,94,0.7), 0 0 30px rgba(34,197,94,0.4)", // glowing button
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow =
              "0 0 25px rgba(34,197,94,1), 0 0 50px rgba(34,197,94,0.8)")
          }
          onMouseOut={(e) =>
            (e.target.style.boxShadow =
              "0 0 15px rgba(34,197,94,0.7), 0 0 30px rgba(34,197,94,0.4)")
          }
        >
          Get Started
        </button>
      </Link>
    </section>
  );
}
