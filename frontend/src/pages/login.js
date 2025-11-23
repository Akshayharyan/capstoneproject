import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, loading, authError } = useAuth();

  // Store input values
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Update state on inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(form.email, form.password);

    if (res.success) {
      navigate("/dashboard");
    }
  };

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
          <h2 style={{ marginBottom: "20px", color: "#22c55e" }}>
            Login to SkillQuest
          </h2>

          {/* Error message */}
          {authError && (
            <p style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
              {authError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
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
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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
              required
            />

            <button
              type="submit"
              disabled={loading}
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
              {loading ? "Logging in..." : "Login"}
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
