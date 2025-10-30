import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Navbar
import Navbar from "./components/Header"; // <-- your navbar file

// Import pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";

import Leaderboard from "./pages/leaderboard";
import AdminDashboard from "./pages/admindashboard";
import Profile from "./pages/Profile"
import Achievements from "./pages/achievements";
import Modules from "./pages/Modules";
import QuestMap from "./pages/QuestMap";


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
        
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
             <Route path="/Modules" element={<Modules />} />
             <Route path="/modules/:id/quests" element={<QuestMap />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
