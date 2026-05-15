import type { FC } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
