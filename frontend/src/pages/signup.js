import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { register, loading, authError } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Register API
    const res = await register(form.name, form.email, form.password);

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
          <h2 style={{ marginBottom: "20px", color: "#22c55e" }}>Create an Account</h2>

          {/* Error message */}
          {authError && (
            <p style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
              {authError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
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
              {loading ? "Creating Account..." : "Sign Up"}
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
