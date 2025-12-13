import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

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
import CreateModulePage from "./pages/admin/CreateModulePage";

// trainee pages
import TraineeSidebar from "./components/TraineeSidebar";
import TraineeModulesPage from "./pages/trainee/TraineeModulesPage";
import TraineeEditTopicsPage from "./pages/trainee/TraineeEditTopicsPage";
import CreateLevelPage from "./pages/trainee/levels/CreateLevelPage";
import AddTaskPage from "./pages/trainee/levels/AddTaskPage";   // ⭐ IMPORTANT

// employee pages
import LevelsRoadmapPage from "./pages/employee/LevelsRoadmapPage";
import LevelPlayerPage from "./pages/employee/LevelPlayerPage";

function App() {
  return (
    <AuthProvider>
      <Router>

        {/* -------- TRAINEE AREA (NO HEADER) -------- */}
        <Routes>
          <Route
            path="/trainee/*"
            element={
              <ProtectedRoute traineeOnly={true}>
                <div className="flex min-h-screen bg-[#0f172a]">
                  <TraineeSidebar />
                  <main className="flex-1 p-10">
                    <Outlet />
                  </main>
                </div>
              </ProtectedRoute>
            }
          >
            {/* Trainee Home */}
            <Route index element={<TraineeModulesPage />} />

            {/* Edit topics */}
            <Route
              path="modules/:moduleId/edit"
              element={<TraineeEditTopicsPage />}
            />

            {/* Create Level */}
            <Route
              path="modules/:moduleId/topics/:topicIndex/create-level"
              element={<CreateLevelPage />}
            />

            {/* ⭐ ADD TASK PAGE — REQUIRED FOR ADDING QUIZ & CODING TASKS */}
            <Route
              path="modules/:moduleId/topics/:topicIndex/levels/:levelIndex/tasks"
              element={<AddTaskPage />}
            />
          </Route>

          {/* -------- EVERYTHING ELSE SHOWS HEADER -------- */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>

                  {/* Guest Routes */}
                  <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
                  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                  <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                  {/* Employee Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                  <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
                  <Route path="/modules/:moduleId/topics" element={<ProtectedRoute><TopicRoadmap /></ProtectedRoute>} />
                   <Route path="/modules/:moduleId/topics/:topicIndex/levels" element={<ProtectedRoute><LevelsRoadmapPage/></ProtectedRoute>} />
<Route path="/modules/:moduleId/topics/:topicIndex/levels/:levelIndex" element={<ProtectedRoute><LevelPlayerPage/></ProtectedRoute>} />
                  {/* Admin */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="create-module" element={<CreateModulePage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="assign" element={<AssignModulePage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                  </Route>
                </Routes>
              </>
            }
          />
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
