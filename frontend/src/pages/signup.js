import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Signup() {
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
          <h2 style={{ marginBottom: "20px", color: "#22c55e" }}>Create an Account</h2>

          <form>
            <input
              type="text"
              placeholder="Full Name"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
              }}
            />
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
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
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
              Sign Up
            </button>
          </form>

          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#22c55e", textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Signup;
