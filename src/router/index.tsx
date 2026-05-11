import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";

// Fallback
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  // "/" → direct redirect to dashboard
  {
    path: "/",
    element: <Navigate to="/cms/dashboard" replace />,
  },

  // Auth routes (without Topbar/Sidebar)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
    ],
  },

  // 404 fallback
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
