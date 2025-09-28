import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Login() {
  return (
    <div style={{ backgroundColor: "#0f172a", color: "white", minHeight: "100vh" }}>
      {/* Centered Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "40px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#22c55e" }}>Login to SkillQuest</h2>
          
          <form>
           <input
  type="email"
  placeholder="Email"
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    backgroundColor: "white", // white input background
    color: "black",           // black typed text
  }}
/>

<input
  type="password"
  placeholder="Password"
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    backgroundColor: "white",
    color: "black",
  }}
/>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#22c55e",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>

          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#22c55e", textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
