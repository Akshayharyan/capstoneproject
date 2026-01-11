import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

/* ================= CONTEXT ================= */
import { AuthProvider } from "./context/AuthContext";

/* ================= ROUTE GUARDS ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

/* ================= COMMON ================= */
import Header from "./components/Header";

/* ================= PUBLIC ================= */
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Features from "./pages/Features";
import About from "./pages/About";

/* ================= EMPLOYEE ================= */
import Dashboard from "./pages/dashboard";
import Modules from "./pages/Modules";
import TopicRoadmap from "./pages/TopicRoadmap";
import TopicVideoPage from "./pages/employee/TopicVideoPage";
import TopicChallengesPage from "./pages/employee/TopicChallengesPage";
import Profile from "./pages/Profile";
import AchievementPage from "./pages/AchievementPage";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateModulePage from "./pages/admin/CreateModulePage";
import UsersPage from "./pages/admin/UsersPage";
import AssignModulePage from "./pages/admin/AssignModulePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

/* ================= TRAINER ================= */
import TrainerSidebar from "./components/TrainerSidebar";
import TrainerModulesPage from "./pages/trainer/TrainerModulesPage";
import TrainerEditTopicsPage from "./pages/trainer/TrainerEditTopicsPage";
import TrainerTopicTasksPage from "./pages/trainer/TrainerTopicTasksPage";

/* ================= LAYOUTS ================= */
const PublicEmployeeLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* =====================================================
              PUBLIC + EMPLOYEE (WITH HEADER)
          ===================================================== */}
          <Route element={<PublicEmployeeLayout />}>

            {/* ---------- PUBLIC ---------- */}
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

            {/* ✅ FEATURES PAGE */}
            <Route path="/features" element={<Features />} />

            <Route path="/about" element={<About />} />

            {/* ---------- EMPLOYEE ---------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/achievements"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <AchievementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <Modules />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules/:moduleId/topics"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <TopicRoadmap />
                </ProtectedRoute>
              }
            />

            {/* ---------- TOPIC FLOW ---------- */}
            <Route
              path="/modules/:moduleId/topic/:topicIndex/video"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <TopicVideoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/modules/:moduleId/topic/:topicIndex/challenges"
              element={
                <ProtectedRoute allow={["employee"]}>
                  <TopicChallengesPage />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* =====================================================
              ADMIN (NO HEADER)
          ===================================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<CreateModulePage />} />
            <Route path="create-module" element={<CreateModulePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="assign" element={<AssignModulePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* =====================================================
              TRAINER (NO HEADER)
          ===================================================== */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allow={["trainer"]}>
                <div className="flex min-h-screen bg-[#f7f8fc]">
  <TrainerSidebar />

  <main className="flex-1 bg-[#f7f8fc] p-10">
    <Outlet />
  </main>
</div>

              </ProtectedRoute>
            }
          >
            <Route index element={<TrainerModulesPage />} />
            <Route
              path="modules/:moduleId/edit"
              element={<TrainerEditTopicsPage />}
            />
            <Route
              path="modules/:moduleId/topic/:topicIndex/tasks"
              element={<TrainerTopicTasksPage />}
            />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
