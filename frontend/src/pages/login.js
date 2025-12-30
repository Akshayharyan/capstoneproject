import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, loading, authError } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(form.email, form.password);

    if (res?.success) {
      const role = res.role?.toLowerCase();
      if (role === "admin") navigate("/admin");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eefcf9] via-white to-[#fff7ed]">
      {/* LOGIN CARD */}
      <div className="flex flex-1 items-center justify-center px-6 pt-28">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10">

          {/* ICON */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-500 flex items-center justify-center text-white text-2xl shadow-md">
            ⚡
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Welcome Back!
          </h2>
          <p className="text-slate-500 text-center text-sm mt-1 mb-8">
            Continue your learning journey
          </p>

          {/* ERROR */}
          {authError && (
            <div className="mb-4 text-sm text-red-600 text-center">
              {authError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* PRIMARY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
              <span>→</span>
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 tracking-wide">
              NEW TO SKILLQUEST?
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* SECONDARY CTA */}
          <Link
            to="/signup"
            className="block w-full text-center py-3 rounded-xl border-2 border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {/* LEGAL */}
      <p className="text-xs text-slate-500 text-center mb-6 px-4">
        By logging in, you agree to our{" "}
        <Link to="/terms" className="text-teal-600 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-teal-600 hover:underline">
          Privacy Policy
        </Link>
      </p>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Login;
