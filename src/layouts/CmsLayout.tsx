import { Outlet } from "react-router";

export default function CmsLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  );
}