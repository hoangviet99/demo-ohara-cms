import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import CmsLayout from "../layouts/CmsLayout";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";

// CMS pages
import DashboardPage  from "../pages/cms/DashboardPage";
import UsersPage      from "../pages/cms/UsersPage";
import CategoriesPage from "../pages/cms/CategoriesPage";
import ProductsPage   from "../pages/cms/ProductsPage";
import ProductAddPage from "../pages/cms/ProductAddPage";
import OrdersPage     from "../pages/cms/OrdersPage";
import OrderDetailPage  from "../pages/cms/OrderDetailPage";

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

  // CMS routes — wrapped in CmsLayout (with Topbar + Sidebar)
  {
    path: "/cms",
    element: <CmsLayout />,
    children: [
      // /cms  →  redirect to /cms/dashboard
      { index: true, element: <Navigate to="/cms/dashboard" replace /> },

      { path: "dashboard",  element: <DashboardPage /> },
      { path: "users",      element: <UsersPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "products",   element: <ProductsPage /> },
      { path: "products/add", element: <ProductAddPage /> },
      { path: "orders",     element: <OrdersPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> },
    ],
  },

  // 404 fallback
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);