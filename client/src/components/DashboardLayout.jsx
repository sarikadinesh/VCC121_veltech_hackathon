import React from "react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="neon-divider">
        <header className="flex flex-col gap-4 px-6 py-6 border-b border-slate-800/60 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Institutional ERMS</p>
            <h1 className="text-2xl font-semibold mt-2">{title}</h1>
            <p className="text-sm text-slate-400">Real-time approvals, resource intelligence, and conflict visibility</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="rounded-full border border-slate-700 px-4 py-1 text-slate-200 hover:border-slate-500" to="/analytics">
              Analytics
            </Link>
            <button
              className="rounded-full bg-slate-800 px-4 py-1 text-slate-200 hover:bg-slate-700"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Sign out
            </button>
          </nav>
        </header>
      </div>
      <main className="px-6 py-8 space-y-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
