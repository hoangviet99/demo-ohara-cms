import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const GuestRoute: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes (e.g., Login page) if not authenticated
  return <Outlet />;
};

export default GuestRoute;
