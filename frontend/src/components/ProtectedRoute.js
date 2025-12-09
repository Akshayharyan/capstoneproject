import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();

  // Deny employees from accessing admin section
  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Deny admins from accessing dashboard pages
  if (!adminOnly && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
