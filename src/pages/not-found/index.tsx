import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <h1 className="mb-2 text-4xl font-bold text-slate-800">404</h1>
      <p className="mb-4 text-slate-600">Page not found</p>
      <Link
        to="/login"
        className="rounded-lg bg-slate-800 px-4 py-2 text-white"
      >
        Back to login
      </Link>
    </div>
  );
}
