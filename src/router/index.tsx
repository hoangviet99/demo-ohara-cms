import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout";
import CmsLayout from "../components/layouts/CmsLayout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import NotFoundPage from "../pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <CmsLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);