import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Navbar
import Navbar from "./components/Header"; // <-- your navbar file

// Import pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Quests from "./pages/quests";
import Leaderboard from "./pages/leaderboard";
import AdminDashboard from "./pages/admindashboard";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar always visible */}
        <Navbar />

        {/* Page Content */}
        <div style={{ marginTop: "60px" }}>  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
