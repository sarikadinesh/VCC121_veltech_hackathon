import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_bottom,_rgba(167,139,250,0.22),transparent_40%)]" />
      <div className="relative max-w-4xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Institutional ERMS</p>
        <h1 className="text-4xl md:text-6xl font-semibold mt-5 leading-tight">
          Institutional Event Resource Management System
        </h1>
        <p className="text-slate-300 mt-5 text-lg">
          Real-time approvals, intelligent resource orchestration, and conflict-aware scheduling for the entire institution.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-200 hover:border-slate-500"
          >
            Login
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { title: "Approval Workflow", desc: "Strict multi-level approvals with audit logging." },
            { title: "Smart Allocation", desc: "Conflict-aware resource locking and reallocation." },
            { title: "Live Intelligence", desc: "Real-time occupancy, utilization, and risk alerts." }
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="text-xs text-slate-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
