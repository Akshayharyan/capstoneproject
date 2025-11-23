import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Navbar
import Navbar from "./components/Header";

// Import pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Leaderboard from "./pages/leaderboard";
import AdminDashboard from "./pages/admindashboard";
import Profile from "./pages/Profile";
import Achievements from "./pages/achievements";
import Modules from "./pages/Modules";
import QuestMap from "./pages/QuestMap";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Navbar always visible */}
          <Navbar />

          {/* Page Content */}
          <div style={{ marginTop: "60px" }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Modules"
                element={
                  <ProtectedRoute>
                    <Modules />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/modules/:id/quests"
                element={
                  <ProtectedRoute>
                    <QuestMap />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
