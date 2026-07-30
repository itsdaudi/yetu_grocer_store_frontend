import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps a page and only renders it if the logged-in user is an admin.
// Anyone else (including logged-out users) gets redirected to Home.
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}