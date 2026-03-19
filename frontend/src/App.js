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
import BossBattleArena from "./pages/employee/BossBattleArena"; // ✅ NEW GAME ARENA
import Leaderboard from "./pages/leaderboard";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateModulePage from "./pages/admin/CreateModulePage";
import UsersPage from "./pages/admin/UsersPage";
import AssignModulePage from "./pages/admin/AssignModulePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import EmployeeMonitoringPage from "./pages/admin/EmployeeMonitoringPage";

/* ================= TRAINER ================= */
import TrainerModulesPage from "./pages/trainer/TrainerModulesPage";
import TrainerEditTopicsPage from "./pages/trainer/TrainerEditTopicsPage";
import TrainerTopicTasksPage from "./pages/trainer/TrainerTopicTasksPage";
import TrainerBossPage from "./pages/trainer/TrainerBossPage";

/* ================= LAYOUT ================= */
const PublicEmployeeLayout = () => (
<>
<Header />
<Outlet />
</>
);

function App() {
return (
<AuthProvider>
<Router>
<Routes>

      {/* ================= PUBLIC + EMPLOYEE ================= */}

      <Route element={<PublicEmployeeLayout />}>

        <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />

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
          path="/leaderboard"
          element={
            <ProtectedRoute allow={["employee"]}>
              <Leaderboard />
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

        {/* ⚔️ BOSS ARENA */}
        <Route
          path="/employee/boss/:moduleId"
          element={
            <ProtectedRoute allow={["employee"]}>
              <BossBattleArena />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ================= ADMIN ================= */}

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
        <Route path="employee-monitoring" element={<EmployeeMonitoringPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* ================= TRAINER ================= */}

      <Route
        path="/trainer"
        element={
          <ProtectedRoute allow={["trainer"]}>
            <TrainerModulesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/modules/:moduleId/edit"
        element={
          <ProtectedRoute allow={["trainer"]}>
            <TrainerEditTopicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/modules/:moduleId/topic/:topicIndex/tasks"
        element={
          <ProtectedRoute allow={["trainer"]}>
            <TrainerTopicTasksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/modules/:moduleId/boss"
        element={
          <ProtectedRoute allow={["trainer"]}>
            <TrainerBossPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  </Router>
</AuthProvider>

);
}

export default App;