import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allow }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allow && !allow.includes(user.role)) {
    // Redirect user to THEIR home
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "trainee") return <Navigate to="/trainee" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
