import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_bottom,_rgba(167,139,250,0.18),transparent_35%)]" />
      <form className="relative w-full max-w-sm glass-panel p-7 rounded-2xl" onSubmit={handleLogin}>
        <h1 className="text-xl font-semibold text-slate-100 mb-1">Sign in</h1>
        <p className="text-xs text-slate-400 mb-5">Access your institutional workflow dashboard.</p>
        <label className="text-xs text-slate-400">Email</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="text-xs text-slate-400">Password</label>
        <input
          type="password"
          className="w-full mt-1 mb-3 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
        <button className="w-full rounded-lg bg-indigo-500 py-2 text-sm font-semibold hover:bg-indigo-400">Login</button>
        <p className="text-xs text-slate-400 mt-3">
          New here? <Link className="underline" to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
