import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
          <span className="text-lg font-semibold">ERMS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm text-slate-300 hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Tagline */}
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.5em] text-indigo-400 font-semibold">
              Smart Event Management
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Institutional Event Resource Management
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Real-time approvals, intelligent resource orchestration, and conflict-aware scheduling. Streamline institutional events with multi-level workflows and zero-conflict guarantees.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-200 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            {
              icon: "✓",
              title: "Multi-Level Approvals",
              desc: "Strict workflow: Coordinator → HOD → Dean → Head with audit trails"
            },
            {
              icon: "⚡",
              title: "Smart Allocation",
              desc: "AI-powered resource allocation with real-time conflict detection"
            },
            {
              icon: "🎯",
              title: "Live Intelligence",
              desc: "Real-time occupancy, risk alerts, and predictive analytics"
            },
            {
              icon: "🔒",
              title: "Hard Constraints",
              desc: "Enforced capacity limits, no double-booking, guaranteed compliance"
            },
            {
              icon: "📊",
              title: "Fairness Analytics",
              desc: "Department-wise resource usage tracking and optimization"
            },
            {
              icon: "⚙️",
              title: "Admin Control",
              desc: "Simulation mode, maintenance toggles, and system auditing"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative glass-panel rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mt-20">
          {[
            { value: "5+", label: "User Roles" },
            { value: "200+", label: "Concurrent Events" },
            { value: "<2s", label: "Live Updates" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
              <p className="text-3xl font-bold text-indigo-400">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Roles Showcase */}
        <div className="mt-20 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">Built for Every Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { role: "Coordinator", icon: "📝", color: "from-blue-500" },
              { role: "HOD", icon: "👔", color: "from-purple-500" },
              { role: "Dean", icon: "🎓", color: "from-indigo-500" },
              { role: "Head", icon: "🏛️", color: "from-pink-500" },
              { role: "Admin", icon: "⚙️", color: "from-cyan-500" }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl bg-gradient-to-br ${item.color}/20 p-4 border border-slate-800/60 text-center hover:border-slate-700/80 transition-all`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-semibold text-slate-100">{item.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Enterprise Security</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> JWT Authentication
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> Role-Based Access Control
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> Audit Logging
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> Encrypted Secrets
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">High Performance</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span> Real-Time Updates
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span> 200+ Concurrent Events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span> Atomic Operations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">⚡</span> Optimized Queries
              </li>
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold">Ready to Transform Your Events?</h2>
          <p className="text-slate-400">Join institutions managing events with intelligence and ease.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-700 px-8 py-3 text-sm text-slate-200 hover:border-slate-500"
            >
              Existing User
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/40 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>Institutional Event Resource Management System © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
