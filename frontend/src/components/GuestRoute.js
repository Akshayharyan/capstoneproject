import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("token");

  // If logged in, redirect away from guest-only pages
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
