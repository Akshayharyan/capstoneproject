import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user, token]);

  // 🔐 LOGIN
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser(data.user);
      setToken(data.token);

      console.log("🔐 Login — Role:", data.user.role);

      return { success: true, role: data.user.role };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER — Everyone becomes EMPLOYEE by default
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "employee" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        authError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
