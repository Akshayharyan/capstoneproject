import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import GuestRoute from "./components/GuestRoute";
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

import QuestList from "./pages/QuestList";


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

  {/* ==== GUEST ONLY ROUTES (Blocked if logged in) ==== */}
  <Route
    path="/"
    element={
      <GuestRoute>
        <Home />
      </GuestRoute>
    }
  />

  <Route
    path="/login"
    element={
      <GuestRoute>
        <Login />
      </GuestRoute>
    }
  />

  <Route
    path="/signup"
    element={
      <GuestRoute>
        <Signup />
      </GuestRoute>
    }
  />

  {/* ==== PROTECTED ROUTES (Login required) ==== */}
  
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
    path="/modules"
    element={
      <ProtectedRoute>
        <Modules />
      </ProtectedRoute>
    }
  />

  {/* Only one valid Quest Route */}
  <Route
    path="/modules/:moduleId/quests"
    element={
      <ProtectedRoute>
        <QuestList />
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
