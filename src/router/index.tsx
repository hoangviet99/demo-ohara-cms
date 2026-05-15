import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout";
import CmsLayout from "../components/layouts/CmsLayout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import NotFoundPage from "../pages/not-found";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <CmsLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);