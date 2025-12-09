import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";

// user pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Leaderboard from "./pages/leaderboard";
import Profile from "./pages/Profile";
import Achievements from "./pages/achievements";
import Modules from "./pages/Modules";
import TopicRoadmap from "./pages/TopicRoadmap";

// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AssignModulePage from "./pages/admin/AssignModulePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* GUEST ROUTES */}
          <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* USER AUTH ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
          <Route path="/modules/:moduleId/topics" element={<ProtectedRoute><TopicRoadmap /></ProtectedRoute>} />

          {/* 🔐 ADMIN ROUTES */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<UsersPage />} />
            <Route path="assign" element={<AssignModulePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
