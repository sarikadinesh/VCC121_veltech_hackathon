import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const roles = [
  { value: "EventCoordinator", label: "Event Coordinator" },
  { value: "HOD", label: "HOD" },
  { value: "Dean", label: "Dean" },
  { value: "InstitutionalHead", label: "Institutional Head" },
  { value: "AdminITC", label: "Admin / ITC" }
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "EventCoordinator"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await api.post("/auth/register", form);
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_bottom,_rgba(167,139,250,0.18),transparent_35%)]" />
      <form className="relative w-full max-w-xl glass-panel p-7 rounded-2xl" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-slate-100 mb-1">Create account</h1>
        <p className="text-xs text-slate-400 mb-5">Register to submit and track institutional events.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Name</label>
            <input
              name="name"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Email</label>
            <input
              name="email"
              type="email"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Password</label>
            <input
              name="password"
              type="password"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Department</label>
            <input
              name="department"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400">Role</label>
            <select
              name="role"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              value={form.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        {success && (
          <p className="text-xs text-emerald-400 mt-3">
            Registration successful. <Link to="/login" className="underline">Login now</Link>
          </p>
        )}
        <button className="w-full mt-4 rounded-lg bg-indigo-500 py-2 text-sm font-semibold hover:bg-indigo-400">Register</button>
        <p className="text-xs text-slate-400 mt-3">
          Already registered? <Link to="/login" className="underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
