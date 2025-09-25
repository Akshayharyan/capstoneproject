import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import pages
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Quests from "./pages/quests";
import Leaderboard from "./pages/leaderboard";
import AdminDashboard from "./pages/admindashboard";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
        <Link to="/" style={{ margin: "0 10px", color: "#fff" }}>Home</Link>
        <Link to="/login" style={{ margin: "0 10px", color: "#fff" }}>Login</Link>
        <Link to="/dashboard" style={{ margin: "0 10px", color: "#fff" }}>Dashboard</Link>
        <Link to="/quests" style={{ margin: "0 10px", color: "#fff" }}>Quests</Link>
        <Link to="/leaderboard" style={{ margin: "0 10px", color: "#fff" }}>Leaderboard</Link>
        <Link to="/admin" style={{ margin: "0 10px", color: "#fff" }}>Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
